const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Limpiando base de datos...');
  await prisma.activity.deleteMany({});
  await prisma.cartera.deleteMany({});
  await prisma.backorder.deleteMany({});
  await prisma.prospect.deleteMany({});

  const products = await prisma.product.findMany();
  const defaultProduct = products.length > 0 ? products[0].name : 'Fertilizante Premium';
  const defaultPrice = products.length > 0 ? products[0].price : 100;

  const data = [
    {
      vendedor: 'America Lizbet Flores Alcala',
      prospectos: ['AgroFuturo Zacatecas', 'Semillas del Centro'],
      clientes: ['Rancho El Mezquite', 'Productores Unidos S.A. de C.V.'],
      pedidos: [
        { doc: 'AGRO-1001', cliente: 'Rancho El Mezquite', pending: 12000, fac: 'FAC-1001' },
        { doc: 'AGRO-1015', cliente: 'Productores Unidos S.A. de C.V.', pending: 4500, fac: 'FAC-1015' }
      ]
    },
    {
      vendedor: 'Luis Gonzales',
      prospectos: ['Agrícola San Miguel', 'Frijoles del Altiplano'],
      clientes: ['Agroinsumos del Norte', 'El Buen Cultivo'],
      pedidos: [
        { doc: 'AGRO-1022', cliente: 'Agroinsumos del Norte', pending: 8000, fac: 'FAC-1022' },
        { doc: 'AGRO-1030', cliente: 'El Buen Cultivo', pending: 3200, fac: 'FAC-1030' }
      ]
    },
    {
      vendedor: 'Edgar Leyton',
      prospectos: ['Campo Verde', 'Productores de Fresnillo'],
      clientes: ['Agrocampo S.A.', 'Rancho La Esperanza'],
      pedidos: [
        { doc: 'AGRO-1041', cliente: 'Agrocampo S.A.', pending: 15000, fac: 'FAC-1041' },
        { doc: 'AGRO-1050', cliente: 'Rancho La Esperanza', pending: 7500, fac: 'FAC-1050' }
      ]
    }
  ];

  for (const sellerData of data) {
    // Insertar Prospectos
    for (const pName of sellerData.prospectos) {
      await prisma.prospect.create({
        data: {
          name: pName,
          vendedor: sellerData.vendedor,
          isClient: false,
          stage: 'Negociación',
          budget: Math.floor(Math.random() * 50000) + 10000
        }
      });
    }

    // Insertar Clientes
    for (const cName of sellerData.clientes) {
      await prisma.prospect.create({
        data: {
          name: cName,
          vendedor: sellerData.vendedor,
          isClient: true,
          stage: 'Venta Completada',
          budget: Math.floor(Math.random() * 100000) + 50000
        }
      });
    }

    // Insertar Pedidos y Cartera
    for (const pedido of sellerData.pedidos) {
      await prisma.backorder.create({
        data: {
          documento: pedido.doc,
          cliente: pedido.cliente,
          vendedor: sellerData.vendedor,
          producto: defaultProduct,
          cantidad: Math.ceil(pedido.pending / defaultPrice),
          precio: defaultPrice,
          pendiente: 10,
          estado: 'Parcial',
          isNewClient: false
        }
      });

      await prisma.cartera.create({
        data: {
          client: pedido.cliente,
          seller: sellerData.vendedor,
          amount: pedido.pending,
          status: 'Pendiente',
          ageGroup: '1-30'
        }
      });
    }
  }

  console.log('¡Datos específicos sembrados con éxito!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
