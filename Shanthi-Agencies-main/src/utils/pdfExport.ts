// Generates and downloads a PDF directly from a rendered DOM element,
// without requiring the browser's Print dialog. Used for:
//  - "Download PDF" button on the wholesale Price List
//  - Auto-downloading the customer's bill when an order is sent via WhatsApp

import type { Html2PdfOptions } from 'html2pdf.js';

export async function downloadElementAsPdf(
  element: HTMLElement,
  filename: string
): Promise<void> {
  // Lazy-load html2pdf.js only when actually needed (keeps initial bundle small)
  const html2pdfModule = await import('html2pdf.js');
  const html2pdf = html2pdfModule.default;

  // The bill / price-list content usually lives inside a modal that constrains
  // it with `max-height` + `overflow-y-auto` so it fits on screen with a
  // scrollbar. If we captured it as-is, the PDF would only include the
  // currently-scrolled-into-view portion. So we temporarily strip
  // height/overflow constraints off every ancestor up to the app root,
  // capture the FULL natural content, then restore everything.
  const restoreFns: (() => void)[] = [];
  let node: HTMLElement | null = element;
  while (node && node.id !== 'root') {
    const el = node;
    const prevOverflow = el.style.overflow;
    const prevOverflowY = el.style.overflowY;
    const prevMaxHeight = el.style.maxHeight;
    const prevHeight = el.style.height;
    el.style.overflow = 'visible';
    el.style.overflowY = 'visible';
    el.style.maxHeight = 'none';
    el.style.height = 'auto';
    restoreFns.push(() => {
      el.style.overflow = prevOverflow;
      el.style.overflowY = prevOverflowY;
      el.style.maxHeight = prevMaxHeight;
      el.style.height = prevHeight;
    });
    node = el.parentElement;
  }

  const options: Html2PdfOptions = {
    margin: [10, 8, 10, 8],
    filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
  };

  try {
    await html2pdf().from(element).set(options).save();
  } finally {
    // Restore original inline styles regardless of success/failure
    restoreFns.reverse().forEach((restore) => restore());
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
