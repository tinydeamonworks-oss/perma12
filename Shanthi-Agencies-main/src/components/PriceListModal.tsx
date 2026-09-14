import React, { useEffect, useState } from 'react';
import { Product, Category } from '../types';
import { BrandLogo } from './BrandLogo';
import { downloadPriceListCSV } from '../utils/priceListExport';
import { downloadPriceListAsPdf } from '../utils/priceListPdf';
import { X, Download, Printer, FileDown, Phone, MapPin, Search, FileSpreadsheet, Sparkles } from 'lucide-react';

interface PriceListModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  categories: Category[];
}

export const PriceListModal: React.FC<PriceListModalProps> = ({
  isOpen,
  onClose,
  products,
  categories,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);


  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = products.filter((p) => {
    const matchCat = selectedCat === 'all' || p.category === selectedCat;
    const q = searchTerm.toLowerCase().trim();
    const matchQuery =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.tamilName.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q);
    return matchCat && matchQuery;
  });

  const handlePrint = () => {
    const source = document.getElementById('printable-pricelist-content');
    if (!source) return;

    const printWindow = window.open('', '_blank', 'width=1000,height=800');
    if (!printWindow) return;

    const clone = source.cloneNode(true) as HTMLElement;
    clone.removeAttribute('id');
    clone.id = 'print-copy';

    // Remove all modal/scroll behaviour from the print copy.
    clone.className = '';
    clone.querySelectorAll<HTMLElement>('*').forEach((el) => {
      el.classList.remove('overflow-x-auto', 'overflow-y-auto', 'overflow-hidden', 'flex-1');
      el.style.overflow = 'visible';
      el.style.maxHeight = 'none';
      el.style.height = 'auto';
      el.style.breakInside = 'auto';
    });

    const styles = `
      @page { size: A4 portrait; margin: 8mm 7mm; }
      * { box-sizing: border-box !important; }
      html, body { margin:0 !important; padding:0 !important; background:#fff !important; color:#111827 !important; }
      body { font-family: Arial, sans-serif !important; }
      #print-copy { display:block !important; width:100% !important; max-width:none !important; margin:0 !important; padding:0 !important; background:#fff !important; overflow:visible !important; font-family:Arial,sans-serif !important; font-size:10px !important; color:#111827 !important; }
      #print-copy > * { display:block !important; width:100% !important; }
      #print-copy h1, #print-copy h2, #print-copy h3, #print-copy p, #print-copy span, #print-copy td, #print-copy th { color:#111827 !important; }
      #print-copy table th { background:#111827 !important; color:#fff !important; }
      #print-copy table { width:100% !important; border-collapse:collapse !important; table-layout:auto !important; }
      #print-copy thead { display:table-header-group !important; }
      #print-copy tbody { display:table-row-group !important; }
      #print-copy tr { display:table-row !important; break-inside:avoid !important; page-break-inside:avoid !important; }
      #print-copy th, #print-copy td { break-inside:avoid !important; page-break-inside:avoid !important; }
      #print-copy .print\\:hidden { display:none !important; }
      #print-copy .hidden { display:none !important; }
      #print-copy img { width:56px !important; height:56px !important; max-width:56px !important; object-fit:cover !important; border-radius:50% !important; display:block !important; flex:none !important; }
      #print-copy > div { overflow:visible !important; max-height:none !important; height:auto !important; }
      #print-copy .print-price-header-top { display:flex !important; flex-direction:row !important; align-items:flex-start !important; justify-content:space-between !important; gap:16px !important; width:100% !important; }
      #print-copy .print-price-brand { display:flex !important; flex-direction:row !important; align-items:flex-start !important; gap:12px !important; flex:1 1 auto !important; min-width:0 !important; }
      #print-copy .print-price-brand-info { display:block !important; flex:1 1 auto !important; min-width:0 !important; }
      #print-copy .print-price-contact { display:block !important; flex:0 0 auto !important; min-width:175px !important; }
      #print-copy .print-price-brand-info h1 { margin:0 !important; }
      #print-copy .print-price-brand-info p { margin:3px 0 0 !important; }
      #print-copy #brand-logo-container { width:56px !important; height:56px !important; min-width:56px !important; display:block !important; flex:0 0 56px !important; }
      #print-copy #brand-logo-crest { width:56px !important; height:56px !important; min-width:56px !important; min-height:56px !important; }
    `;

    printWindow.document.open();
    printWindow.document.write(`<!doctype html><html><head><meta charset="UTF-8"><title>Prema Fireworks - Complete Price List</title><style>${styles}</style></head><body></body></html>`);
    printWindow.document.close();
    printWindow.document.body.appendChild(clone);

    const doPrint = () => {
      printWindow.focus();
      printWindow.print();
      setTimeout(() => printWindow.close(), 250);
    };

    setTimeout(doPrint, 500);
  };

  const handleDownloadCSV = () => {
    downloadPriceListCSV(products, categories);
  };

  const handleDownloadPDF = async () => {
    if (isDownloadingPdf) return;
    setIsDownloadingPdf(true);
    try {
      const source = document.getElementById('printable-pricelist-content');
      if (!source) throw new Error('Price list content not found.');
      await downloadPriceListAsPdf(
        source,
        'Prema-Fireworks-Price-List.pdf'
      );
    } catch (err) {
      console.error('Price list PDF download failed:', err);
      window.alert('PDF download failed. Please try again.');
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 bg-slate-900/75 backdrop-blur-xs"
      id="price-list-modal-overlay"
    >
      <div className="relative w-full max-w-4xl bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-200">
        {/* Top Control Bar (Hidden during Print) */}
        <div className="print:hidden bg-slate-900 text-white p-4 sm:px-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-amber-400 text-slate-950 font-black">
              <FileSpreadsheet className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-sm sm:text-base font-black text-white uppercase tracking-wide">
                Prema Fireworks • Complete Price List
              </h2>
              <p className="text-[11px] text-amber-300 font-semibold">
                Direct Sivakasi Factory Wholesale Rates ({products.length} items)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadCSV}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-sm uppercase tracking-wider"
              id="modal-download-csv-btn"
              title="Download Excel / CSV file"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download CSV/Excel</span>
              <span className="sm:hidden">CSV</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={isDownloadingPdf}
              className="bg-amber-500 hover:bg-amber-400 disabled:opacity-60 disabled:cursor-wait text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-sm uppercase tracking-wider"
              id="modal-download-pdf-btn"
              title="Download as a PDF file"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isDownloadingPdf ? 'Preparing PDF...' : 'Download PDF'}</span>
              <span className="sm:hidden">PDF</span>
            </button>

            <button
              onClick={handlePrint}
              className="bg-red-700 hover:bg-red-800 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-sm uppercase tracking-wider"
              id="modal-print-btn"
              title="Print this price list"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              type="button"
              onPointerDown={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onClose();
              }}
              onMouseDown={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onClose();
              }}
              onTouchStart={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onClose();
              }}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onClose();
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              aria-label="Close price list modal"
              id="modal-close-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter controls inside modal (Hidden during Print) */}
        <div className="print:hidden bg-slate-50 p-3 sm:px-6 border-b border-slate-200 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search items in price list..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-red-600"
            />
          </div>

          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-red-600 font-semibold"
          >
            <option value="all">All Categories ({products.length})</option>
            {categories.filter((c) => c.id !== 'all').map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.tamilName})
              </option>
            ))}
          </select>

          <span className="text-xs font-semibold text-slate-500 ml-auto">
            Showing {filtered.length} of {products.length}
          </span>
        </div>

        {/* Printable & Scrollable Price List Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8" id="printable-pricelist-content">
          {/* Header */}
          <div className="print-price-header border-b-2 border-red-700 pb-4 mb-4">
            <div className="print-price-header-top flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="print-price-brand flex items-center gap-3">
                <BrandLogo size="md" showText={false} />
                <div className="print-price-brand-info">
                  <h1 className="font-['Cinzel',serif] text-xl sm:text-2xl font-black text-slate-900 tracking-wide uppercase">
                    PREMA FIREWORKS
                  </h1>
                  <p className="text-xs font-bold text-red-700 uppercase">
                    Exclusive Fireworks Showroom • Cuddalore
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium">
                    No. 26, Mariyamman Kovil Street, N.R. Palayam, Ariyankuppam Post, Cuddalore
                  </p>
                </div>
              </div>

              <div className="print-price-contact text-left sm:text-right text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <p className="font-bold text-slate-900">Direct Booking / Enquiries</p>
                <p className="text-red-700 font-black text-sm">📞 +91 9600830112</p>
                <p className="text-[10px] text-slate-500">Festival Season Price List</p>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse border border-slate-200">
              <thead>
                <tr className="bg-slate-900 text-white font-bold uppercase text-[10px] tracking-wider">
                  <th className="p-2.5 border border-slate-800 text-center w-12">#</th>
                  <th className="p-2.5 border border-slate-800">Product Name</th>
                  <th className="p-2.5 border border-slate-800">Tamil Name</th>
                  <th className="p-2.5 border border-slate-800 text-center">Packing</th>
                  <th className="p-2.5 border border-slate-800 text-right">MRP</th>
                  <th className="p-2.5 border border-slate-800 text-right bg-red-800 text-white">
                    Our Price
                  </th>
                  <th className="p-2.5 border border-slate-800 text-center">Discount</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product, idx) => (
                  <tr
                    key={product.id}
                    className={`border-b border-slate-200 ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'
                    }`}
                  >
                    <td className="p-2 text-center text-slate-400 font-mono text-[10px]">
                      {idx + 1}
                    </td>
                    <td className="p-2 font-bold text-slate-900">
                      {product.name}
                    </td>
                    <td className="p-2 text-slate-600 font-medium">
                      {product.tamilName}
                    </td>
                    <td className="p-2 text-center text-slate-600 font-medium">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-semibold">
                        {product.unit}
                      </span>
                    </td>
                    <td className="p-2 text-right text-slate-400 line-through">
                      ₹{product.mrp}
                    </td>
                    <td className="p-2 text-right font-black text-red-700 bg-red-50/40">
                      ₹{product.price}
                    </td>
                    <td className="p-2 text-center">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                        {product.discountPercent}% OFF
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Notes */}
          <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-500 flex flex-wrap items-center justify-between gap-2">
            <p>
              * Prices subject to seasonal stock availability. All products are 100% Genuine Green Fireworks.
            </p>
            <p className="font-bold text-slate-700">
              Showroom Contact: 9600830112
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
