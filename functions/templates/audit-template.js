/**
 * CancelKit - PDF Audit Report Template Generator
 * This file contains functions to generate a PDF template for monthly audit reports
 */

const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs').promises;
const path = require('path');

/**
 * Creates a blank PDF template for the monthly audit report
 * @returns {Promise<Uint8Array>} The PDF document as a byte array
 */
async function createAuditTemplate() {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  
  // Add a blank page
  const page = pdfDoc.addPage([612, 792]); // Letter size
  
  // Get the standard font
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  // Set font size and line height
  const titleFontSize = 18;
  const headerFontSize = 12;
  const fontSize = 10;
  const lineHeight = 20;
  
  // Add title
  page.drawText('CancelKit Compliance Log', {
    x: 50,
    y: 730,
    size: titleFontSize,
    font: helveticaBold,
    color: rgb(0, 0, 0),
  });
  
  // Add report metadata placeholders
  page.drawText('Vendor: {VENDOR_KEY}', {
    x: 50,
    y: 700,
    size: headerFontSize,
    font: helveticaFont,
    color: rgb(0, 0, 0),
  });
  
  page.drawText('Period: {REPORT_PERIOD}', {
    x: 50,
    y: 680,
    size: headerFontSize,
    font: helveticaFont,
    color: rgb(0, 0, 0),
  });
  
  page.drawText('Generated: {GENERATION_DATE}', {
    x: 50,
    y: 660,
    size: headerFontSize,
    font: helveticaFont,
    color: rgb(0, 0, 0),
  });
  
  // Draw table header
  const tableTop = 620;
  const col1 = 50;  // userId
  const col2 = 250; // timestamp
  const col3 = 450; // IP address
  
  // Table header
  page.drawText('User ID', {
    x: col1,
    y: tableTop,
    size: headerFontSize,
    font: helveticaBold,
    color: rgb(0, 0, 0),
  });
  
  page.drawText('Timestamp', {
    x: col2,
    y: tableTop,
    size: headerFontSize,
    font: helveticaBold,
    color: rgb(0, 0, 0),
  });
  
  page.drawText('IP Address', {
    x: col3,
    y: tableTop,
    size: headerFontSize,
    font: helveticaBold,
    color: rgb(0, 0, 0),
  });
  
  // Draw horizontal line below header
  page.drawLine({
    start: { x: 50, y: tableTop - 10 },
    end: { x: 550, y: tableTop - 10 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  
  // Serialize the PDFDocument to bytes
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

/**
 * Saves the template to disk
 */
async function saveTemplate() {
  try {
    // Create the templates directory if it doesn't exist
    await fs.mkdir(path.join(__dirname), { recursive: true });
    
    // Generate the template
    const pdfBytes = await createAuditTemplate();
    
    // Save to file
    await fs.writeFile(path.join(__dirname, 'audit-template.pdf'), pdfBytes);
    
    console.log('Audit template created successfully');
  } catch (error) {
    console.error('Error creating audit template:', error);
  }
}

// Export the functions
module.exports = {
  createAuditTemplate,
  saveTemplate
};

// If this file is run directly, save the template
if (require.main === module) {
  saveTemplate();
}
