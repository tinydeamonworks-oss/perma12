import React, { useState } from 'react';
import { CartItem, CustomerOrderInfo, OfferMilestone } from '../types';
import { BrandLogo } from './BrandLogo';
import { downloadElementByIdAsPdf } from '../utils/pdfExport';
import { X, Printer, FileDown, MessageSquare, Phone, MapPin } from 'lucide-react';

interface EstimateModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  customerInfo: CustomerOrderInfo;
  milestones: OfferMilestone[];
}

export const EstimateModal: React.FC<EstimateModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  customerInfo,
  milestones,
}) => {
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  // NOTE: This component stays mounted (rather than returning null) even when
  // `isOpen` is false. It is positioned off-screen in that case. This keeps the
  // `#printable-estimate-content` bill markup always present in the DOM so the
  // Cart Drawer can silently generate/download a PDF bill (e.g. right before
  // sending a WhatsApp order) without first requiring the user to open this
  // modal. When `isOpen` is true it displays normally as the visible modal.

  const totalMrp = cartItems.reduce((sum, item) => sum + item.product.mrp * item.quantity, 0);
  const totalAmount = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalSavings = totalMrp - totalAmount;
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const unlockedRewards = milestones.filter((m) => totalAmount >= m.minAmount);

  const estimateNumber = `EST-SA-${Math.floor(100000 + Math.random() * 900000)}`;
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (isDownloadingPdf) return;
    setIsDownloadingPdf(true);
    try {
      await downloadElementByIdAsPdf(
        'printable-estimate-content',
        `Prema-Fireworks-Estimate-${estimateNumber}.pdf`
      );
    } catch (err) {
      console.error('Estimate PDF download failed:', err);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <div
      className={
        isOpen
          ? 'fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-xs'
          : 'fixed top-0 -left-[9999px] z-[-1] pointer-events-none opacity-0'
      }
      id="estimate-modal-overlay"
      aria-hidden={!isOpen}
    >
      <div className="relative w-full max-w-3xl bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-200">
        {/* Modal Top Control Bar (Hidden during print) */}
        <div className="print:hidden bg-slate-900 text-white p-3.5 px-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-100">
            <span>Official Price Quotation / Estimate Sheet</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloadingPdf}
              className="bg-amber-500 hover:bg-amber-400 disabled:opacity-60 disabled:cursor-wait text-slate-950 font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-sm uppercase tracking-wider"
              id="download-estimate-pdf-btn"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>{isDownloadingPdf ? 'Preparing...' : 'Download PDF'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="bg-red-700 hover:bg-red-800 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-sm uppercase tracking-wider"
              id="print-estimate-btn"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              aria-label="Close estimate"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Estimate Sheet Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 text-slate-800 printable-area font-sans" id="printable-estimate-content">
          {/* Header Section */}
          <div className="border-b-2 border-red-700 pb-5 mb-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <BrandLogo size="lg" showText={false} />
                <div>
                  <div className="text-xs font-black uppercase tracking-widest text-red-700">
                    Exclusive Fireworks Showroom
                  </div>
                  <h1 className="font-['Cinzel',serif] text-2xl sm:text-3xl font-black text-slate-900 leading-tight uppercase">
                    PREMA FIREWORKS
                  </h1>
                  <p className="text-xs text-slate-600 font-bold">
                    FIREWORKS THAT INSPIRE • DIRECT SIVAKASI FACTORY RATES
                  </p>
                </div>
              </div>

              {/* Estimate Details */}
              <div className="text-left sm:text-right text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                <p className="font-bold text-red-700 text-sm">PRICE ESTIMATE</p>
                <p className="text-slate-600 font-mono">Ref: {estimateNumber}</p>
                <p className="text-slate-600">Date: {currentDate}</p>
              </div>
            </div>

            {/* Showroom Address Bar */}
            <div className="mt-3 pt-3 border-t border-slate-200 text-xs text-slate-700 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-700 shrink-0" />
                <span>
                  <strong>No. 26, Mariyamman Kovil Street</strong>, N.R. Palayam, Ariyankuppam Post, Cuddalore T.K.
                </span>
              </div>
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <Phone className="w-3.5 h-3.5 text-red-700" />
                <span>Cell: 9600830112</span>
              </div>
            </div>
          </div>

          {/* Customer Info Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <span className="text-slate-500 font-semibold block text-[10px] uppercase">Customer Name:</span>
                <strong className="text-slate-900 text-sm">{customerInfo.name || 'Valued Customer'}</strong>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block text-[10px] uppercase">WhatsApp Contact:</span>
                <strong className="text-slate-900 text-sm">{customerInfo.phone || 'Not provided'}</strong>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block text-[10px] uppercase">State, District & PIN:</span>
                <strong className="text-slate-900">
                  {[customerInfo.district || 'Cuddalore', customerInfo.state || 'Tamil Nadu'].filter(Boolean).join(', ')}{' '}
                  {customerInfo.pincode ? `- ${customerInfo.pincode}` : ''}
                </strong>
              </div>
            </div>
            {(customerInfo.addressLine1 || customerInfo.addressLine2) && (
              <div className="mt-2.5 pt-2.5 border-t border-slate-200">
                <span className="text-slate-500 font-semibold block text-[10px] uppercase">Delivery Address:</span>
                <p className="text-slate-800 font-medium">
                  {[
                    customerInfo.addressLine1,
                    customerInfo.addressLine2,
                    customerInfo.district,
                    customerInfo.state,
                    customerInfo.pincode,
                  ]
                    .filter(Boolean)
                    .join(', ')}
                </p>
              </div>
            )}
            {customerInfo.notes && (
              <div className="mt-1.5 text-[11px] text-slate-500">
                <span className="font-semibold">Note:</span> {customerInfo.notes}
              </div>
            )}
          </div>

          {/* Items Table */}
          <div className="rounded-xl border border-slate-200 overflow-hidden mb-5">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-white uppercase text-[10px] tracking-wider font-bold">
                <tr>
                  <th className="py-2.5 px-3 text-center w-10">S.No</th>
                  <th className="py-2.5 px-3">Item Description</th>
                  <th className="py-2.5 px-3">Packing</th>
                  <th className="py-2.5 px-3 text-right">MRP (₹)</th>
                  <th className="py-2.5 px-3 text-right">Rate (₹)</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {cartItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500 italic">
                      No items added yet. Please add products to view estimate.
                    </td>
                  </tr>
                ) : (
                  cartItems.map((item, index) => {
                    const lineTotal = item.product.price * item.quantity;
                    return (
                      <tr key={item.product.id} className="hover:bg-slate-50">
                        <td className="py-2 px-3 text-center text-slate-400 font-mono">
                          {index + 1}
                        </td>
                        <td className="py-2 px-3">
                          <strong className="text-slate-900">{item.product.name}</strong>
                          <span className="text-slate-500 text-[11px] block">
                            {item.product.tamilName}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-slate-600 font-medium">
                          {item.product.unit}
                        </td>
                        <td className="py-2 px-3 text-right text-slate-400 line-through">
                          ₹{item.product.mrp}
                        </td>
                        <td className="py-2 px-3 text-right font-bold text-red-600">
                          ₹{item.product.price}
                        </td>
                        <td className="py-2 px-3 text-center font-bold text-slate-900">
                          {item.quantity}
                        </td>
                        <td className="py-2 px-3 text-right font-black text-slate-900">
                          ₹{lineTotal.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Totals & Savings Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
            {/* Rewards & Terms */}
            <div className="bg-red-50/50 rounded-xl p-3.5 border border-red-100 text-xs">
              <h4 className="font-bold text-red-900 text-[11px] uppercase tracking-wider mb-1.5">
                🎉 Festive Rewards & Terms:
              </h4>
              {unlockedRewards.length > 0 ? (
                <ul className="space-y-1 text-green-800 font-semibold mb-2">
                  {unlockedRewards.map((r) => (
                    <li key={r.minAmount} className="flex items-center gap-1">
                      <span>✓</span> <span>{r.rewardTitle} included free of cost!</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-600 text-[11px] mb-2">
                  Orders above ₹3,000 get complimentary festive sparklers gifts.
                </p>
              )}
              <p className="text-[10px] text-slate-500 leading-tight">
                * Rates are valid for seasonal festival booking. Subject to stock availability. Direct showroom pickup available at N.R. Palayam, Ariyankuppam, Cuddalore.
              </p>
            </div>

            {/* Price Calculations */}
            <div className="bg-slate-900 text-white rounded-xl p-4 space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Total Items:</span>
                <span className="font-bold">{totalQuantity} Units / Boxes</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Total MRP Value:</span>
                <span className="line-through">₹{totalMrp.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-green-400 font-bold">
                <span>Discount:</span>
                <span>- ₹{totalSavings.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-slate-700 text-sm sm:text-base font-extrabold text-white">
                <span>Net Payable Amount:</span>
                <span className="text-xl font-black text-amber-400">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-6 pt-4 border-t border-slate-200 text-center text-xs text-slate-500">
            <p className="font-bold text-slate-800">
              PREMA FIREWORKS • Prop: D. Seetharaman • No. 26, Mariyamman Kovil Street, N.R. Palayam, Ariyankuppam Post, Cuddalore T.K. • Contact: 9600830112 / 9626200112
            </p>
            <p className="text-[11px] mt-0.5">
              Wishing You and Your Family a Happy & Prosperous Safe Diwali Celebration! 🪔✨
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

