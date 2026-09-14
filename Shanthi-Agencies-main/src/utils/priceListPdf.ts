import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Render the price list in small page-sized chunks. Rendering the complete
 * 200+ row table as one giant canvas can hang the browser, so each PDF page
 * gets its own canvas and is then added to one A4 PDF.
 */
export async function downloadPriceListAsPdf(
  source: HTMLElement,
  filename: string,
): Promise<void> {
  const table = source.querySelector('table');
  if (!table) throw new Error('Price list table not found.');

  const rows = Array.from(table.querySelectorAll('tbody tr')) as HTMLTableRowElement[];
  const tableHead = table.querySelector('thead');
  const header = Array.from(source.children).find((el) =>
    el.querySelector('h1')?.textContent?.includes('PREMA FIREWORKS')
  ) as HTMLElement | undefined;
  const footer = Array.from(source.children).find((el) =>
    el.textContent?.includes('Prices subject to seasonal stock availability')
  ) as HTMLElement | undefined;

  const filteredRows = rows.length ? rows : [];
  const pages: HTMLElement[] = [];
  const rowsPerPageFirst = 24;
  const rowsPerPageOther = 30;
  let index = 0;
  let first = true;

  while (index < filteredRows.length || (filteredRows.length === 0 && first)) {
    const page = document.createElement('div');
    page.style.cssText = [
      'width:794px',
      'background:#fff',
      'color:#111827',
      'box-sizing:border-box',
      'padding:28px 30px 24px',
      'font-family:Arial,sans-serif',
      'font-size:12px',
      'line-height:1.25',
      'position:absolute',
      'left:-10000px',
      'top:0',
      'z-index:-1',
    ].join(';');

    if (first && header) page.appendChild(header.cloneNode(true));

    const pageTable = table.cloneNode(false) as HTMLTableElement;
    pageTable.removeAttribute('class');
    pageTable.style.cssText = 'width:100%;border-collapse:collapse;table-layout:fixed;';

    if (tableHead) {
      const thead = tableHead.cloneNode(true) as HTMLTableSectionElement;
      thead.style.display = 'table-header-group';
      pageTable.appendChild(thead);
    }

    const tbody = document.createElement('tbody');
    const limit = first ? rowsPerPageFirst : rowsPerPageOther;
    for (const row of filteredRows.slice(index, index + limit)) {
      const copy = row.cloneNode(true) as HTMLTableRowElement;
      copy.style.cssText = 'display:table-row;page-break-inside:avoid;break-inside:avoid;';
      copy.querySelectorAll<HTMLElement>('*').forEach((el) => {
        el.style.maxHeight = 'none';
        el.style.overflow = 'visible';
      });
      tbody.appendChild(copy);
    }
    pageTable.appendChild(tbody);
    page.appendChild(pageTable);

    if (index + limit >= filteredRows.length && footer) {
      page.appendChild(footer.cloneNode(true));
    }

    pages.push(page);
    document.body.appendChild(page);
    index += limit;
    first = false;
  }

  const pdf = new jsPDF({
    unit: 'mm',
    format: 'a4',
    orientation: 'portrait',
    compress: true,
  });

  try {
    for (let i = 0; i < pages.length; i += 1) {
      const page = pages[i];
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

      const canvas = await html2canvas(page, {
        scale: 1.35,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: 794,
        windowWidth: 794,
        scrollX: 0,
        scrollY: 0,
      });

      if (i > 0) pdf.addPage();

      const margin = 7;
      const pageWidth = 210;
      const pageHeight = 297;
      const contentWidth = pageWidth - margin * 2;
      const ratio = contentWidth / canvas.width;
      const contentHeight = canvas.height * ratio;
      const y = Math.max(margin, (pageHeight - contentHeight) / 2);

      pdf.addImage(
        canvas.toDataURL('image/jpeg', 0.94),
        'JPEG',
        margin,
        y,
        contentWidth,
        Math.min(contentHeight, pageHeight - margin * 2),
        undefined,
        'FAST',
      );
    }

    pdf.save(filename);
  } finally {
    pages.forEach((page) => page.remove());
  }
}
