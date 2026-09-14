import type { Html2PdfOptions } from 'html2pdf.js';

export async function downloadElementAsPdf(
  element: HTMLElement,
  filename: string
): Promise<void> {
  const html2pdfModule = await import('html2pdf.js');
  const html2pdf = html2pdfModule.default;

  const exportHost = document.createElement('div');
  exportHost.setAttribute('data-pdf-export-host', 'true');
  Object.assign(exportHost.style, {
    position: 'fixed',
    left: '-100000px',
    top: '0',
    width: '794px',
    background: '#fff',
    zIndex: '-1',
    pointerEvents: 'none',
  });

  const clone = element.cloneNode(true) as HTMLElement;
  clone.removeAttribute('id');

  // Completely detach the PDF copy from modal scrolling/layout rules.
  Object.assign(clone.style, {
    display: 'block',
    position: 'static',
    width: '794px',
    maxWidth: '794px',
    height: 'auto',
    maxHeight: 'none',
    minHeight: '0',
    overflow: 'visible',
    margin: '0',
    padding: '24px',
    boxSizing: 'border-box',
    background: '#fff',
    color: '#111827',
  });

  clone.querySelectorAll<HTMLElement>('.overflow-x-auto, .overflow-y-auto').forEach((el) => {
    el.style.overflow = 'visible';
    el.style.overflowX = 'visible';
    el.style.overflowY = 'visible';
    el.style.maxHeight = 'none';
    el.style.height = 'auto';
  });

  // Prevent the site's print-only visibility CSS and Tailwind layout utilities
  // from hiding the exported copy.
  const style = document.createElement('style');
  style.textContent = `
    [data-pdf-export-host], [data-pdf-export-host] * {
      visibility: visible !important;
      opacity: 1 !important;
      animation: none !important;
      transition: none !important;
    }
    [data-pdf-export-host] .print\\:hidden { display: none !important; }
    [data-pdf-export-host] table { width: 100% !important; border-collapse: collapse !important; }
    [data-pdf-export-host] thead { display: table-header-group !important; }
    [data-pdf-export-host] tr { break-inside: avoid !important; page-break-inside: avoid !important; }
  `;
  exportHost.appendChild(style);
  exportHost.appendChild(clone);
  document.body.appendChild(exportHost);

  const options: Html2PdfOptions = {
    margin: [6, 6, 6, 6],
    filename,
    image: { type: 'jpeg', quality: 0.96 },
    html2canvas: {
      scale: 1,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 794,
      windowWidth: 794,
      scrollX: 0,
      scrollY: 0,
      logging: false,
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait', compress: true },
    pagebreak: { mode: ['css', 'legacy'] },
  };

  try {
    await new Promise<void>((resolve) => requestAnimationFrame(() => setTimeout(resolve, 100)));
    await html2pdf().from(clone).set(options).save();
  } finally {
    exportHost.remove();
  }
}

export async function downloadElementByIdAsPdf(
  elementId: string,
  filename: string
): Promise<void> {
  const el = document.getElementById(elementId);
  if (!el) throw new Error(`Element with id "${elementId}" not found for PDF export.`);
  await downloadElementAsPdf(el, filename);
}
