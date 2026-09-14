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
    position: 'absolute',
    left: '-900px',
    top: '0',
    width: '794px',
    background: '#fff',
    zIndex: '2147483647',
    pointerEvents: 'none',
  });

  const clone = element.cloneNode(true) as HTMLElement;
  clone.removeAttribute('id');
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

  clone.querySelectorAll<HTMLElement>('*').forEach((el) => {
    el.style.maxHeight = 'none';
    el.style.height = el.style.height === '100%' ? 'auto' : el.style.height;
    el.style.overflow = 'visible';
  });

  clone.querySelectorAll<HTMLElement>('.overflow-x-auto, .overflow-y-auto, .overflow-hidden').forEach((el) => {
    el.style.overflow = 'visible';
    el.style.maxHeight = 'none';
    el.style.height = 'auto';
  });

  const style = document.createElement('style');
  style.textContent = `
    [data-pdf-export-host], [data-pdf-export-host] * {
      visibility: visible !important;
      opacity: 1 !important;
      animation: none !important;
      transition: none !important;
    }
    [data-pdf-export-host] .print\\:hidden { display: none !important; }
    [data-pdf-export-host] .hidden { display: none !important; }
    [data-pdf-export-host] table { width: 100% !important; border-collapse: collapse !important; table-layout: auto !important; }
    [data-pdf-export-host] thead { display: table-header-group !important; }
    [data-pdf-export-host] tbody { display: table-row-group !important; }
    [data-pdf-export-host] tr { display: table-row !important; break-inside: avoid !important; page-break-inside: avoid !important; }
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
    if (document.fonts?.ready) await Promise.race([document.fonts.ready, new Promise((resolve) => setTimeout(resolve, 1500))]);
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
