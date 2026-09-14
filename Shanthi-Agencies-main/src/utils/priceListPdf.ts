import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForImages(root: HTMLElement): Promise<void> {
  const images = Array.from(root.querySelectorAll('img'));
  await Promise.all(
    images.map(async (img) => {
      if (img.complete && img.naturalWidth > 0) return;
      await new Promise<void>((resolve) => {
        const done = () => {
          img.removeEventListener('load', done);
          img.removeEventListener('error', done);
          resolve();
        };
        img.addEventListener('load', done, { once: true });
        img.addEventListener('error', done, { once: true });
      });
    }),
  );
}

function makeCleanPage(source: HTMLElement, rows: HTMLTableRowElement[], includeHeader: boolean, includeFooter: boolean) {
  const page = document.createElement('div');
  Object.assign(page.style, {
    position: 'fixed',
    left: '0',
    top: '0',
    width: '794px',
    minHeight: '1123px',
    padding: '28px 30px',
    boxSizing: 'border-box',
    background: '#ffffff',
    color: '#111827',
    fontFamily: 'Arial, sans-serif',
    fontSize: '12px',
    lineHeight: '1.25',
    opacity: '0',
    pointerEvents: 'none',
    zIndex: '2147483647',
  });

  if (includeHeader) {
    const header = document.createElement('div');
    header.style.cssText = 'border-bottom:2px solid #b91c1c;padding-bottom:12px;margin-bottom:12px;';
    const top = document.createElement('div');
    top.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:16px;';

    const brand = document.createElement('div');
    brand.style.cssText = 'display:flex;align-items:center;gap:10px;min-width:0;';
    const sourceImg = source.querySelector('img');
    if (sourceImg) {
      const img = sourceImg.cloneNode(true) as HTMLImageElement;
      img.style.cssText = 'width:56px!important;height:56px!important;max-width:56px!important;object-fit:cover;border-radius:50%;display:block;flex:none;';
      brand.appendChild(img);
    }
    const titleBox = document.createElement('div');
    const title = document.createElement('div');
    title.textContent = 'PREMA FIREWORKS';
    title.style.cssText = 'font-size:24px;font-weight:900;letter-spacing:1px;color:#111827;';
    const sub = document.createElement('div');
    sub.textContent = 'Exclusive Fireworks Showroom • Cuddalore';
    sub.style.cssText = 'font-size:11px;font-weight:700;color:#b91c1c;text-transform:uppercase;margin-top:3px;';
    const addr = document.createElement('div');
    addr.textContent = 'No. 26, Mariyamman Kovil Street, N.R. Palayam, Ariyankuppam Post, Cuddalore';
    addr.style.cssText = 'font-size:9px;color:#64748b;margin-top:4px;';
    titleBox.append(title, sub, addr);
    brand.appendChild(titleBox);

    const contact = document.createElement('div');
    contact.style.cssText = 'text-align:right;font-size:10px;color:#111827;';
    contact.innerHTML = '<b>Direct Booking / Enquiries</b><br><span style="font-size:13px;font-weight:900;color:#b91c1c">+91 9600830112</span><br><span style="font-size:9px;color:#64748b">Festival Season Price List</span>';
    top.append(brand, contact);
    header.appendChild(top);
    page.appendChild(header);
  }

  const table = document.createElement('table');
  table.style.cssText = 'width:100%;border-collapse:collapse;table-layout:fixed;font-size:10px;';
  const colWidths = ['6%', '20%', '24%', '13%', '11%', '13%', '13%'];
  const colgroup = document.createElement('colgroup');
  colWidths.forEach((width) => {
    const col = document.createElement('col');
    col.style.width = width;
    colgroup.appendChild(col);
  });
  table.appendChild(colgroup);

  const thead = document.createElement('thead');
  const hr = document.createElement('tr');
  ['#', 'Product Name', 'Tamil Name', 'Packing', 'MRP', 'Our Price', 'Discount'].forEach((text, i) => {
    const th = document.createElement('th');
    th.textContent = text;
    th.style.cssText = `padding:6px 5px;border:1px solid #cbd5e1;background:${i === 5 ? '#991b1b' : '#111827'};color:#fff;text-align:${i === 0 || i === 3 || i === 6 ? 'center' : i >= 4 ? 'right' : 'left'};font-weight:800;`;
    hr.appendChild(th);
  });
  thead.appendChild(hr);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  rows.forEach((row, idx) => {
    const cells = Array.from(row.cells).map((cell) => cell.textContent?.trim() || '');
    const tr = document.createElement('tr');
    const values = [String(idx + 1), ...cells.slice(1)];
    values.forEach((text, i) => {
      const td = document.createElement('td');
      td.textContent = text;
      const align = i === 0 || i === 3 || i === 6 ? 'center' : i >= 4 ? 'right' : 'left';
      const color = i === 5 ? '#b91c1c' : i === 0 ? '#64748b' : '#111827';
      td.style.cssText = `padding:5px 5px;border:1px solid #e2e8f0;background:${idx % 2 ? '#f8fafc' : '#fff'};text-align:${align};font-weight:${i === 1 || i === 5 ? '700' : '500'};color:${color};white-space:normal;word-break:break-word;`;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  page.appendChild(table);

  if (includeFooter) {
    const footer = document.createElement('div');
    footer.textContent = '* Prices subject to seasonal stock availability. All products are 100% Genuine Green Fireworks.    Showroom Contact: 9600830112';
    footer.style.cssText = 'margin-top:10px;padding-top:8px;border-top:1px solid #e2e8f0;font-size:9px;color:#64748b;';
    page.appendChild(footer);
  }

  return page;
}

export async function downloadPriceListAsPdf(source: HTMLElement, filename: string): Promise<void> {
  const table = source.querySelector('table');
  if (!table) throw new Error('Price list table not found.');
  const rows = Array.from(table.querySelectorAll('tbody tr')) as HTMLTableRowElement[];
  if (!rows.length) throw new Error('No price list items found.');

  const pages: HTMLElement[] = [];
  let offset = 0;
  const firstCount = 26;
  const otherCount = 34;

  while (offset < rows.length) {
    const first = offset === 0;
    const count = first ? firstCount : otherCount;
    const pageRows = rows.slice(offset, offset + count);
    const page = makeCleanPage(source, pageRows, first, offset + count >= rows.length);
    document.body.appendChild(page);
    pages.push(page);
    offset += count;
  }

  const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait', compress: true });

  try {
    await wait(100);
    for (let i = 0; i < pages.length; i += 1) {
      const page = pages[i];
      await waitForImages(page);
      const canvas = await html2canvas(page, {
        backgroundColor: '#ffffff',
        scale: 1,
        useCORS: true,
        allowTaint: false,
        logging: false,
        width: 794,
        height: 1123,
        windowWidth: 794,
        windowHeight: 1123,
        scrollX: 0,
        scrollY: 0,
      });

      if (i > 0) pdf.addPage();
      const image = canvas.toDataURL('image/jpeg', 0.92);
      pdf.addImage(image, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
    }
    pdf.save(filename);
  } finally {
    pages.forEach((page) => page.remove());
  }
}
