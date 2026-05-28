import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const generatePremiumPDF = (config) => {
  const doc = new jsPDF();
  const PAGE_WIDTH = doc.internal.pageSize.width;
  const PAGE_HEIGHT = doc.internal.pageSize.height;
  
  // Colores corporativos
  const COLOR_PRIMARY = [30, 91, 50]; // Verde oscuro #1e5b32
  const COLOR_TEXT_DARK = [30, 41, 59]; // slate-800
  const COLOR_TEXT_LIGHT = [100, 116, 139]; // slate-500
  const COLOR_BORDER = [226, 232, 240]; // slate-200
  const COLOR_BG_LIGHT = [248, 250, 252]; // slate-50
  
  // Helpers
  const addRoundedRect = (x, y, w, h, fill = false) => {
    doc.setDrawColor(...COLOR_BORDER);
    if (fill) doc.setFillColor(...COLOR_BG_LIGHT);
    doc.roundedRect(x, y, w, h, 3, 3, fill ? 'FD' : 'S');
  };

  const addText = (text, x, y, size, color, isBold = false, align = 'left') => {
    doc.setFontSize(size);
    doc.setTextColor(...color);
    doc.setFont("helvetica", isBold ? "bold" : "normal");
    doc.text(String(text), x, y, { align });
  };

  // --- 1. HEADER ---
  // Logo
  if (config.logoBase64) {
    try {
      doc.addImage(config.logoBase64, 'PNG', 14, 14, 30, 30);
    } catch (e) { console.warn("Logo failed"); }
  }

  // Company Name
  addText("AgriFlow Pro", 48, 22, 24, COLOR_PRIMARY, true);
  addText("Sistema Comercial y Logístico", 48, 28, 10, COLOR_TEXT_LIGHT);

  // Document Title
  addText((config.title || "REPORTE").toUpperCase(), 48, 40, 14, COLOR_PRIMARY, true, 'left');

  // Header Details (Folio, Date, etc)
  let headerDetailY = 22;
  if (config.headerDetails && config.headerDetails.length > 0) {
    config.headerDetails.forEach(detail => {
      addText(detail.label, PAGE_WIDTH - 75, headerDetailY, 9, COLOR_TEXT_LIGHT, false, 'left');
      addText(detail.value, PAGE_WIDTH - 14, headerDetailY, 9, COLOR_TEXT_DARK, true, 'right');
      headerDetailY += 6;
    });
  }

  // Status Pill
  if (config.statusPill) {
    const pillText = config.statusPill.text || "";
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    const textWidth = doc.getTextWidth(pillText);
    const pillWidth = textWidth + 12;
    const pillX = PAGE_WIDTH - 14 - pillWidth;
    
    // Parse colors from hex if provided, else defaults
    doc.setFillColor(240, 253, 244); // bg-green-50 by default
    doc.setDrawColor(34, 197, 94); // border-green-500
    if (config.statusPill.bg) doc.setFillColor(config.statusPill.bg);
    if (config.statusPill.color) doc.setTextColor(config.statusPill.color);
    else doc.setTextColor(22, 163, 74);
    
    doc.roundedRect(pillX, headerDetailY, pillWidth, 7, 3, 3, 'FD');
    doc.text(pillText, pillX + 6, headerDetailY + 5);
  }

  // Separator Line
  doc.setDrawColor(...COLOR_PRIMARY);
  doc.line(14, 52, PAGE_WIDTH - 14, 52);

  let currentY = 60;

  // --- 2. CARDS ---
  if (config.cards && config.cards.length > 0) {
    const cardWidth = (PAGE_WIDTH - 28 - ((config.cards.length - 1) * 6)) / config.cards.length;
    let cardX = 14;
    
    config.cards.forEach(card => {
      addRoundedRect(cardX, currentY, cardWidth, 22, false);
      addText(card.title, cardX + 14, currentY + 7, 7, COLOR_TEXT_LIGHT, true);
      addText(card.value, cardX + 14, currentY + 13, 9, COLOR_TEXT_DARK, true);
      addText(card.sub, cardX + 14, currentY + 18, 8, COLOR_TEXT_LIGHT);
      cardX += cardWidth + 6;
    });
    currentY += 30;
  }

  // --- 3. TABLE ---
  if (config.table) {
    autoTable(doc, {
      startY: currentY,
      head: config.table.head,
      body: config.table.body,
      theme: 'grid',
      headStyles: { 
        fillColor: COLOR_PRIMARY, 
        textColor: [255, 255, 255], 
        fontStyle: 'bold',
        halign: 'center'
      },
      bodyStyles: { 
        textColor: COLOR_TEXT_DARK,
        halign: 'center'
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252] // light gray
      },
      styles: {
        fontSize: 9,
        cellPadding: 4,
        lineColor: [226, 232, 240], // border color
        lineWidth: 0.1
      },
      margin: { left: 14, right: 14 }
    });
    currentY = doc.lastAutoTable.finalY + 8;
  }

  // Check if we need a new page for the summary and bottom blocks
  if (currentY > PAGE_HEIGHT - 60) {
    doc.addPage();
    currentY = 20;
  }

  // --- 4. SUMMARY (Subtotal, Totals) ---
  if (config.summary) {
    // Left Box (e.g. Total products)
    if (config.summary.left && config.summary.left.length > 0) {
      addRoundedRect(14, currentY, 80, 22, true);
      let sy = currentY + 9;
      config.summary.left.forEach(item => {
        addText(item.label, 20, sy, 9, COLOR_TEXT_DARK, true);
        addText(item.value, 85, sy, 9, COLOR_TEXT_DARK, true, 'right');
        sy += 7;
      });
    }

    // Right Box (Subtotal, Tax, Total)
    if (config.summary.right && config.summary.right.length > 0) {
      let sy = currentY + 9;
      config.summary.right.forEach(item => {
        const isTotal = item.isTotal || false;
        
        if (isTotal) {
          doc.setDrawColor(...COLOR_BORDER);
          doc.line(PAGE_WIDTH - 120, sy - 5, PAGE_WIDTH - 14, sy - 5);
          sy += 4;
        }

        const fontSize = isTotal ? 11 : 9;
        const color = item.color || COLOR_TEXT_DARK;
        
        // Let's pass array colors or parse simple hex
        let rgbColor = color;
        if (typeof color === 'string' && color.startsWith('#')) {
           rgbColor = hexToRgb(color);
        }

        addText(item.label, PAGE_WIDTH - 120, sy, fontSize, isTotal ? COLOR_TEXT_DARK : COLOR_TEXT_LIGHT, isTotal);
        addText(item.value, PAGE_WIDTH - 14, sy, fontSize, rgbColor, isTotal, 'right');
        sy += isTotal ? 10 : 7;
      });
      currentY = sy > currentY + 22 ? sy : currentY + 22;
    } else {
      currentY += 22;
    }
    currentY += 8;
  }

  // --- 5. BOTTOM BLOCKS (Timeline, Notes) ---
  if (config.bottomBlocks && config.bottomBlocks.length > 0) {
    const blockWidth = (PAGE_WIDTH - 28 - ((config.bottomBlocks.length - 1) * 6)) / config.bottomBlocks.length;
    let blockX = 14;
    
    config.bottomBlocks.forEach(block => {
      addRoundedRect(blockX, currentY, blockWidth, 35, false);
      addText(block.title, blockX + 6, currentY + 8, 9, COLOR_PRIMARY, true);
      
      if (block.content) {
         addText(block.content, blockX + 6, currentY + 16, 8, COLOR_TEXT_LIGHT);
      }

      // If it's a timeline block (custom render for order status)
      if (block.type === 'timeline' && block.steps) {
        let stepX = blockX + 10;
        const stepWidth = (blockWidth - 20) / block.steps.length;
        
        doc.setDrawColor(...COLOR_BORDER);
        doc.line(stepX + 5, currentY + 15, blockX + blockWidth - 15, currentY + 15);

        block.steps.forEach((step, idx) => {
           // draw circle
           if (step.completed) {
              doc.setFillColor(34, 197, 94);
              doc.circle(stepX, currentY + 15, 3, 'F');
           } else {
              doc.setFillColor(255, 255, 255);
              doc.circle(stepX, currentY + 15, 3, 'FD');
           }
           addText(step.label, stepX, currentY + 22, 7, COLOR_TEXT_DARK, true, 'center');
           if (step.date) addText(step.date, stepX, currentY + 26, 6, COLOR_TEXT_LIGHT, false, 'center');
           if (step.time) addText(step.time, stepX, currentY + 29, 6, COLOR_TEXT_LIGHT, false, 'center');

           stepX += stepWidth;
        });
      }
      
      blockX += blockWidth + 6;
    });
    currentY += 40;
  }

  // --- 6. FOOTER ---
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(...COLOR_BORDER);
    doc.line(14, PAGE_HEIGHT - 20, PAGE_WIDTH - 14, PAGE_HEIGHT - 20);
    
    // Website / System info
    addText("AgriFlow Pro", 14, PAGE_HEIGHT - 12, 9, COLOR_PRIMARY, true);
    addText("Sistema Comercial y Logístico", 14, PAGE_HEIGHT - 8, 7, COLOR_TEXT_LIGHT);
    addText("www.agriflowpro.com", 14, PAGE_HEIGHT - 4, 7, COLOR_PRIMARY, true);

    // Generation Info & Paging
    const genDate = new Date().toLocaleString('es-MX');
    addText(`Documento generado el ${genDate}`, PAGE_WIDTH - 14, PAGE_HEIGHT - 12, 7, COLOR_TEXT_LIGHT, false, 'right');
    addText("Este documento no requiere firma.", PAGE_WIDTH - 14, PAGE_HEIGHT - 8, 7, COLOR_TEXT_LIGHT, false, 'right');
    addText(`Página ${i} de ${totalPages}`, PAGE_WIDTH - 14, PAGE_HEIGHT - 4, 7, COLOR_TEXT_LIGHT, false, 'right');
  }

  doc.save(config.filename || `Reporte_${new Date().toISOString().split('T')[0]}.pdf`);
};

// Helper to convert hex to RGB array for jsPDF
function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : [0,0,0];
}
