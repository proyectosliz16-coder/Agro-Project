  const updateProspectStage = async (id, newStage, isClientValue, isConversion = false) => {
    try {
      // 1. SI PASA A RECIBIR PEDIDO, ACTIVAR LOGÍSTICA E INVENTARIO
      if (newStage === 'Recibir Pedido') {
        const p = (prospects || []).find(item => item.id === id);
        if (p) {
          const draftBOs = (backorders || []).filter(bo => bo.cliente === p.name && bo.estado === 'Cotización');
          
          if (draftBOs.length > 0) {
            for (const bo of draftBOs) {
              // A. Activar en Logística/Facturación
              await fetch(`/api/backorders/${bo.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...bo, estado: 'Entrega Pendiente' })
              });

              // B. Descontar Stock
              const product = (products || []).find(prod => prod.name.toUpperCase() === bo.producto.toUpperCase());
              if (product) {
                await fetch(`/api/products/${product.id}/stock`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ decrementBy: bo.cantidad })
                });
              }
            }
          } else {
            // Fallback: Crear backorder genérico si no había cotización previa
            await fetch('/api/backorders', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                cliente: p.name,
                vendedor: user?.name || 'Sistema',
                producto: p.interest || 'Pedido desde Pipeline',
                documento: `PED-${Date.now().toString().slice(-6)}`,
                precio: p.budget || 0,
                cantidad: 1,
                pendiente: 1,
                estado: 'Entrega Pendiente',
                prioridad: 'Media',
                isNewClient: !isClientValue
              })
            });
          }
        }
      }

      // 2. ACTUALIZAR LA ETAPA EN BASE DE DATOS
      const resp = await fetch(`/api/prospects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage, isClient: isClientValue })
      });

      if (resp.ok) {
        if (isConversion) alert('¡Felicidades! Se ha convertido en cliente. Búscalo ahora en la pestaña "Clientes".');
        if (refreshData) refreshData();
      } else {
        alert('Error al actualizar el registro.');
      }
    } catch (e) {
      console.error(e);
      alert('Error de conexión con el servidor.');
    }
  };
