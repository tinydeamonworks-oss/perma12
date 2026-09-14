// Generates a PDF from a rendered DOM element without opening the browser
// Print dialog. The export is rendered from a detached clone so modal
// scrolling/positioning cannot affect the PDF output.

import type { Html2PdfOptions } from 'html2pdf.js';

export async function downloadElementAsPdf(
  element: HTMLElement,
  filename: string
): Promise<void> {
  const html2pdfModule = await import('html2pdf.js');
  const html2pdf = html2pdfModule.default;

  // A4 width at 96 CSS px/in. Keeping the clone outside the modal removes
  // fixed/max-height/overflow constraints and captures the complete list.
  const exportHost = document.createElement('div');
  exportHost.setAttribute('data-pdf-export-host', 'true');
  Object.assign(exportHost.style, {
    position: 'fixed',
    left: '-100000px',
    top: '0',
    width: '794px',
    minHeight: '1123px',
    overflow: 'visible',
    background: '#ffffff',
    zIndex: '-1',
    pointerEvents: 'none',
  });

  const clone = element.cloneNode(true) as HTMLElement;
  clone.removeAttribute('id');
  Object.assign(clone.style, {
    width: '794px',
    maxWidth: '794px',
    height: 'auto',
    maxHeight: 'none',
    minHeight: '0',
    overflow: 'visible',
    overflowY: 'visible',
    overflowX: 'visible',
    position: 'static',
    margin: '0',
    boxSizing: 'border-box',
    background: '#ffffff',
  });

  // The table's horizontal-scroll wrapper must not become a clipped PDF.
  clone.querySelectorAll<HTMLElement>('.overflow-x-auto, .overflow-y-auto').forEach((el) => {
    el.style.overflow = 'visible';
    el.style.overflowX = 'visible';
    el.style.overflowY = 'visible';
    el.style.maxHeight = 'none';
    el.style.height = 'auto';
  });

  exportHost.appendChild(clone);
  document.body.appendChild(exportHost);

  const options: Html2PdfOptions = {
    margin: [8, 7, 8, 7],
    filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      // Lower canvas scale keeps large 200+ item lists responsive while preserving A4 readability.
      scale: 1,
      useCORS: true,
      backgroundColor: '#ffffff',
      width: 794,
      windowWidth: 794,
      scrollX: 0,
      scrollY: 0,
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    // Avoid-all can create huge/blank pages for long tables. CSS/legacy
    // pagebreak handling lets the table flow naturally across A4 pages.
    pagebreak: { mode: ['css', 'legacy'] },
  };

  try {
    // Let React/browser finish the clone layout before starting the heavy canvas work.
    await new Promise<void>((resolve) => requestAnimationFrame(() => setTimeout(resolve, 0)));
    clone.querySelectorAll<HTMLElement>('*').forEach((node) => {
      node.style.animation = 'none';
      node.style.transition = 'none';
    });
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
  if (!el) {
    throw new Error(`Element with id "${elementId}" not found for PDF export.`);
  }
  await downloadElementAsPdf(el, filename);
}
