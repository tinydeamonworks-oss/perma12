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

async function waitForImages(root: HTMLElement): Promise<void> {
  const images = Array.from(root.querySelectorAll('img'));
  await Promise.all(images.map(async (img) => {
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
  }));
}

function makeCleanPage(source: HTMLElement, rows: HTMLTableRowElement[], includeHeader: boolean, includeFooter: boolean, logoDataUrl: string) {
  const page = document.createElement('div');
  Object.assign(page.style, {
    position: 'absolute', left: '-10000px', top: '0', width: '794px', minHeight: '1123px',
    padding: '24px 28px', boxSizing: 'border-box', background: '#fff', color: '#111827',
    fontFamily: 'Arial, sans-serif', fontSize: '12px', lineHeight: '1.25', opacity: '1',
    pointerEvents: 'none',
  });

  if (includeHeader) {
    const header = document.createElement('div');
    header.style.cssText = 'border-bottom:2px solid #b91c1c;padding-bottom:10px;margin-bottom:10px;';
    const top = document.createElement('div');
    top.style.cssText = 'display:flex;align-items:flex-start;justify-content:space-between;gap:16px;width:100%;';
    const brand = document.createElement('div');
    brand.style.cssText = 'display:flex;align-items:flex-start;gap:10px;flex:1;min-width:0;';
    const img = document.createElement('img');
    img.src = logoDataUrl;
    img.alt = 'Prema Fireworks Logo';
    img.style.cssText = 'width:56px;height:56px;object-fit:cover;border-radius:50%;display:block;flex:none;';
    brand.appendChild(img);
    const titleBox = document.createElement('div');
    titleBox.style.cssText = 'min-width:0;';
    const title = document.createElement('div'); title.textContent = 'PREMA FIREWORKS';
    title.style.cssText = 'font-size:22px;font-weight:900;letter-spacing:1px;color:#111827;';
    const sub = document.createElement('div'); sub.textContent = 'Exclusive Fireworks Showroom • Cuddalore';
    sub.style.cssText = 'font-size:10px;font-weight:700;color:#b91c1c;margin-top:2px;';
    const addr = document.createElement('div'); addr.textContent = 'No. 26, Mariyamman Kovil Street, N.R. Palayam, Ariyankuppam Post, Cuddalore';
    addr.style.cssText = 'font-size:9px;color:#64748b;margin-top:4px;';
    titleBox.append(title, sub, addr); brand.appendChild(titleBox);
    const contact = document.createElement('div');
    contact.style.cssText = 'text-align:right;font-size:9px;color:#111827;flex:none;';
    contact.innerHTML = '<b>Direct Booking / Enquiries</b><br><span style="font-size:12px;font-weight:900;color:#b91c1c">+91 9600830112</span><br><span style="font-size:8px;color:#64748b">Festival Season Price List</span>';
    top.append(brand, contact); header.appendChild(top); page.appendChild(header);
  }

  const table = document.createElement('table');
  table.style.cssText = 'width:100%;border-collapse:collapse;table-layout:fixed;font-size:9px;';
  const colgroup = document.createElement('colgroup');
  ['6%','20%','24%','13%','11%','13%','13%'].forEach((w) => { const c=document.createElement('col'); c.style.width=w; colgroup.appendChild(c); });
  table.appendChild(colgroup);
  const thead = document.createElement('thead'); const hr = document.createElement('tr');
  ['#','Product Name','Tamil Name','Packing','MRP','Our Price','Discount'].forEach((text,i)=>{
    const th=document.createElement('th'); th.textContent=text;
    th.style.cssText=`padding:5px 4px;border:1px solid #cbd5e1;background:${i===5?'#991b1b':'#111827'};color:#fff;text-align:${i===0||i===3||i===6?'center':i>=4?'right':'left'};font-weight:800;`;
    hr.appendChild(th);
  });
  thead.appendChild(hr); table.appendChild(thead);
  const tbody=document.createElement('tbody');
  rows.forEach((row,idx)=>{
    const cells=Array.from(row.cells).map(c=>c.textContent?.trim()||'');
    const tr=document.createElement('tr');
    [String(idx+1),...cells.slice(1)].forEach((text,i)=>{
      const td=document.createElement('td'); td.textContent=text;
      const align=i===0||i===3||i===6?'center':i>=4?'right':'left';
      td.style.cssText=`padding:4px;border:1px solid #e2e8f0;background:${idx%2?'#f8fafc':'#fff'};text-align:${align};font-weight:${i===1||i===5?'700':'500'};color:${i===5?'#b91c1c':i===0?'#64748b':'#111827'};white-space:normal;word-break:break-word;`;
      tr.appendChild(td);
    }); tbody.appendChild(tr);
  });
  table.appendChild(tbody); page.appendChild(table);
  if (includeFooter) { const footer=document.createElement('div'); footer.textContent='* Prices subject to seasonal stock availability. All products are 100% Genuine Green Fireworks.    Showroom Contact: 9600830112'; footer.style.cssText='margin-top:8px;padding-top:6px;border-top:1px solid #e2e8f0;font-size:8px;color:#64748b;'; page.appendChild(footer); }
  return page;
}

export async function downloadPriceListAsPdf(source: HTMLElement, filename: string): Promise<void> {
  const table=source.querySelector('table');
  if(!table) throw new Error('Price list table not found.');
  const rows=Array.from(table.querySelectorAll('tbody tr')) as HTMLTableRowElement[];
  if(!rows.length) throw new Error('No price list items found.');

  const logoDataUrl=await imageToDataUrl(logoImg);
  const host=document.createElement('div');
  Object.assign(host.style,{position:'fixed',left:'0',top:'0',width:'1px',height:'1px',overflow:'hidden',opacity:'0',pointerEvents:'none'});
  document.body.appendChild(host);
  const pages:HTMLElement[]=[]; let offset=0; const firstCount=27; const otherCount=36;
  try {
    while(offset<rows.length){
      const count=offset===0?firstCount:otherCount;
      const page=makeCleanPage(source,rows.slice(offset,offset+count),offset===0,offset+count>=rows.length,logoDataUrl);
      host.appendChild(page); pages.push(page); offset+=count;
    }
    const pdf=new jsPDF({unit:'mm',format:'a4',orientation:'portrait',compress:true});
    for(let i=0;i<pages.length;i++){
      const page=pages[i]; await waitForImages(page); await wait(50);
      const canvas=await html2canvas(page,{backgroundColor:'#fff',scale:1,useCORS:false,allowTaint:false,logging:false,width:794,height:1123,windowWidth:794,windowHeight:1123,scrollX:0,scrollY:0});
      if(i>0) pdf.addPage();
      pdf.addImage(canvas.toDataURL('image/jpeg',0.9),'JPEG',0,0,210,297,undefined,'FAST');
      canvas.width=1; canvas.height=1;
    }
    pdf.save(filename);
  } finally { host.remove(); }
}
