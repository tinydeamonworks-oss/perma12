import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import logoImg from '../assets/images/prema_fireworks_logo.jpeg';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function imageToDataUrl(src: string): Promise<string> {
  const response = await fetch(src, { cache: 'force-cache' });
  if (!response.ok) throw new Error(`Logo request failed: ${response.status}`);
  const blob = await response.blob();
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Could not prepare logo for PDF.'));
    reader.readAsDataURL(blob);
  });
}

function makeCleanPage(
  doc: Document,
  rows: HTMLTableRowElement[],
  includeHeader: boolean,
  includeFooter: boolean,
  logoDataUrl: string,
) {
  const page = doc.createElement('div');
  page.style.cssText = [
    'width:794px', 'height:1123px', 'box-sizing:border-box', 'padding:24px 28px',
    'background:#ffffff', 'color:#111827', 'font-family:Arial,sans-serif',
    'font-size:12px', 'line-height:1.25', 'overflow:hidden', 'display:block',
  ].join(';');

  if (includeHeader) {
    const header = doc.createElement('div');
    header.style.cssText = 'border-bottom:2px solid #b91c1c;padding-bottom:10px;margin-bottom:10px;';
    const top = doc.createElement('div');
    top.style.cssText = 'display:flex;align-items:flex-start;gap:16px;width:100%;';

    const brand = doc.createElement('div');
    brand.style.cssText = 'display:flex;align-items:flex-start;gap:10px;flex:1;min-width:0;';
    const img = doc.createElement('img');
    img.src = logoDataUrl;
    img.alt = 'Prema Fireworks Logo';
    img.style.cssText = 'width:56px;height:56px;object-fit:contain;display:block;flex:0 0 56px;';
    brand.appendChild(img);

    const titleBox = doc.createElement('div');
    titleBox.style.cssText = 'min-width:0;';
    const title = doc.createElement('div');
    title.textContent = 'PREMA FIREWORKS';
    title.style.cssText = 'font-size:22px;font-weight:900;letter-spacing:1px;color:#111827;';
    const sub = doc.createElement('div');
    sub.textContent = 'Exclusive Fireworks Showroom • Cuddalore';
    sub.style.cssText = 'font-size:10px;font-weight:700;color:#b91c1c;margin-top:2px;';
    const addr = doc.createElement('div');
    addr.textContent = 'No. 26, Mariyamman Kovil Street, N.R. Palayam, Ariyankuppam Post, Cuddalore';
    addr.style.cssText = 'font-size:9px;color:#64748b;margin-top:4px;';
    titleBox.append(title, sub, addr);
    brand.appendChild(titleBox);

    const contact = doc.createElement('div');
    contact.style.cssText = 'text-align:right;font-size:9px;color:#111827;flex:0 0 175px;';
    contact.innerHTML = '<b>Direct Booking / Enquiries</b><br><span style="font-size:12px;font-weight:900;color:#b91c1c">+91 9600830112</span><br><span style="font-size:8px;color:#64748b">Festival Season Price List</span>';
    top.append(brand, contact);
    header.appendChild(top);
    page.appendChild(header);
  }

  const table = doc.createElement('table');
  table.style.cssText = 'width:100%;border-collapse:collapse;table-layout:fixed;font-size:9px;';
  const colgroup = doc.createElement('colgroup');
  ['6%','20%','24%','13%','11%','13%','13%'].forEach((w) => {
    const c = doc.createElement('col');
    c.style.width = w;
    colgroup.appendChild(c);
  });
  table.appendChild(colgroup);

  const thead = doc.createElement('thead');
  const hr = doc.createElement('tr');
  ['#','Product Name','Tamil Name','Packing','MRP','Our Price','Discount'].forEach((text, i) => {
    const th = doc.createElement('th');
    th.textContent = text;
    th.style.cssText = `padding:5px 4px;border:1px solid #cbd5e1;background:${i === 5 ? '#991b1b' : '#111827'};color:#fff;text-align:${i === 0 || i === 3 || i === 6 ? 'center' : i >= 4 ? 'right' : 'left'};font-weight:800;`;
    hr.appendChild(th);
  });
  thead.appendChild(hr);
  table.appendChild(thead);

  const tbody = doc.createElement('tbody');
  rows.forEach((row, idx) => {
    const cells = Array.from(row.cells).map((c) => c.textContent?.trim() || '');
    const tr = doc.createElement('tr');
    [String(idx + 1), ...cells.slice(1)].forEach((text, i) => {
      const td = doc.createElement('td');
      td.textContent = text;
      const align = i === 0 || i === 3 || i === 6 ? 'center' : i >= 4 ? 'right' : 'left';
      td.style.cssText = `padding:4px;border:1px solid #e2e8f0;background:${idx % 2 ? '#f8fafc' : '#fff'};text-align:${align};font-weight:${i === 1 || i === 5 ? '700' : '500'};color:${i === 5 ? '#b91c1c' : i === 0 ? '#64748b' : '#111827'};white-space:normal;word-break:break-word;`;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  page.appendChild(table);

  if (includeFooter) {
    const footer = doc.createElement('div');
    footer.textContent = '* Prices subject to seasonal stock availability. All products are 100% Genuine Green Fireworks.    Showroom Contact: 9600830112';
    footer.style.cssText = 'margin-top:8px;padding-top:6px;border-top:1px solid #e2e8f0;font-size:8px;color:#64748b;';
    page.appendChild(footer);
  }

  return page;
}

/**
 * Renders the PDF pages in an isolated iframe. This is intentional: the live app
 * uses Tailwind v4, whose generated stylesheet contains `oklch(...)` colors.
 * html2canvas 1.4.x cannot parse those colors, so rendering inside the app DOM
 * makes PDF export fail even when the export markup itself only uses hex colors.
 */
async function renderPageInIsolatedDocument(page: HTMLElement): Promise<HTMLCanvasElement> {
  const iframe = document.createElement('iframe');
  iframe.setAttribute('aria-hidden', 'true');
  iframe.style.cssText = 'position:fixed;left:-10000px;top:0;width:794px;height:1123px;border:0;opacity:1;pointer-events:none;';
  document.body.appendChild(iframe);

  try {
    const frameDoc = iframe.contentDocument;
    if (!frameDoc) throw new Error('Could not create an isolated PDF document.');

    frameDoc.open();
    frameDoc.write('<!doctype html><html><head><meta charset="UTF-8"><title>PDF</title></head><body style="margin:0;background:#fff;"></body></html>');
    frameDoc.close();
    frameDoc.body.appendChild(page);

    const images = Array.from(frameDoc.images);
    await Promise.all(images.map(async (img) => {
      if (img.complete && img.naturalWidth > 0) return;
      await new Promise<void>((resolve) => {
        const done = () => resolve();
        img.addEventListener('load', done, { once: true });
        img.addEventListener('error', done, { once: true });
      });
    }));

    await wait(50);
    return await html2canvas(page, {
      backgroundColor: '#ffffff',
      scale: 1,
      useCORS: false,
      allowTaint: false,
      logging: false,
      width: 794,
      height: 1123,
      windowWidth: 794,
      windowHeight: 1123,
      scrollX: 0,
      scrollY: 0,
    });
  } finally {
    iframe.remove();
  }
}

export async function downloadPriceListAsPdf(source: HTMLElement, filename: string): Promise<void> {
  const table = source.querySelector('table');
  if (!table) throw new Error('Price list table not found.');
  const rows = Array.from(table.querySelectorAll('tbody tr')) as HTMLTableRowElement[];
  if (!rows.length) throw new Error('No price list items found.');

  const logoDataUrl = await imageToDataUrl(logoImg);
  const pages: HTMLElement[] = [];
  let offset = 0;
  const firstCount = 27;
  const otherCount = 36;

  // Build each page in a detached HTML document so no app/Tailwind styles leak in.
  const pageDoc = document.implementation.createHTMLDocument('Price List PDF');
  while (offset < rows.length) {
    const count = offset === 0 ? firstCount : otherCount;
    pages.push(makeCleanPage(pageDoc, rows.slice(offset, offset + count), offset === 0, offset + count >= rows.length, logoDataUrl));
    offset += count;
  }

  const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait', compress: true });
  for (let i = 0; i < pages.length; i++) {
    const canvas = await renderPageInIsolatedDocument(pages[i]);
    if (i > 0) pdf.addPage();
    pdf.addImage(canvas.toDataURL('image/jpeg', 0.9), 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
  }
  pdf.save(filename);
}
