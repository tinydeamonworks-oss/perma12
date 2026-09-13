import React from 'react';
import logoImg from '../assets/images/prema_fireworks_logo.jpeg';
import {
  ShoppingBag,
  Phone,
  MessageSquare,
  FileText,
  MapPin,
  Sparkles,
  Download,
} from 'lucide-react';

interface NavbarProps {
  totalItems: number;
  totalAmount: number;
  onOpenCart: () => void;
  onOpenEstimate: () => void;
  onOpenPriceList: () => void;
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  categories: { id: string; name: string; tamilName: string }[];
  categoryCounts?: Record<string, number>;
}

export const Navbar: React.FC<NavbarProps> = ({
  totalItems,
  totalAmount,
  onOpenCart,
  onOpenEstimate,
  onOpenPriceList,
  selectedCategory,
  onSelectCategory,
  categories,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full shadow-lg" id="main-header">
      {/* Top Festive Announcement Bar */}
      <div className="bg-red-900 text-white text-xs py-1.5 px-3 border-b border-red-950/40 w-full overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0 overflow-hidden">
            <span className="bg-amber-400 text-red-950 font-black px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] uppercase shrink-0">
              FLAT 20% OFF
            </span>
            <span className="font-bold text-[10px] sm:text-xs text-amber-200 truncate">
              Diwali Mega Discount • Sivakasi Factory Direct Price
            </span>
          </div>

          <div className="flex items-center gap-2.5 text-[10px] sm:text-xs font-medium shrink-0 ml-auto">
            <div className="hidden md:flex items-center gap-1 opacity-90">
              <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>Mariyamman Kovil St, Cuddalore</span>
            </div>
            <a
              href="tel:9600830112"
              className="flex items-center gap-1 bg-white/15 hover:bg-white/25 px-2 py-0.5 rounded-lg border border-white/20 text-white font-bold transition-colors text-[11px] shrink-0"
              title="Call Prema Fireworks"
            >
              <Phone className="w-3 h-3 text-amber-300 shrink-0" />
              <span>9600830112</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="bg-red-700 text-white px-3 py-2 sm:px-6 sm:py-3 shadow-md w-full">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo & Showroom Title */}
          <a
            href="#"
            className="hover:opacity-95 transition-opacity flex items-center gap-2 sm:gap-3 min-w-0 flex-1 sm:flex-initial"
            id="nav-brand-link"
          >
            <div className="w-10 h-10 sm:w-13 sm:h-13 rounded-full border-2 border-amber-300 shadow-md shrink-0 bg-slate-950 overflow-hidden flex items-center justify-center p-0.5">
              <img
                src={logoImg}
                alt="Prema Fireworks Logo"
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm sm:text-lg md:text-xl font-black tracking-tight uppercase leading-tight text-white font-['Cinzel',serif] truncate">
                  Prema Fireworks
                </h1>
                <span className="hidden sm:inline-block bg-amber-400 text-red-950 text-[10px] font-black uppercase px-1.5 py-0.5 rounded shadow-2xs">
                  Exclusive
                </span>
              </div>
              <p className="text-[10px] sm:text-xs font-semibold text-amber-200 leading-tight tracking-wide truncate">
                Cuddalore Showroom
              </p>
            </div>
          </a>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0" id="nav-actions">
            {/* Download Price List Button ("inga download than varunum inga fulter vara kudathu") */}
            <button
              onClick={onOpenPriceList}
              className="bg-amber-400 hover:bg-amber-300 text-red-950 font-black px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1 sm:gap-1.5 shadow-sm border border-amber-300 transition-transform active:scale-95 shrink-0 uppercase tracking-wide cursor-pointer"
              id="nav-download-pricelist-btn"
              title="Download Price List (PDF / Excel)"
            >
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-950 shrink-0" />
              <span>Download</span>
              <span className="hidden md:inline">Price List</span>
            </button>

            {/* WhatsApp Quick Link */}
            <a
              href="https://wa.me/919600830112?text=Hi%20Prema%20Fireworks%2C%20I%20would%20like%20to%20know%20more%20about%20fireworks%20and%20offers."
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-xl text-xs font-bold shadow transition-colors border border-emerald-400/40 shrink-0"
              id="nav-whatsapp-btn"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-100" />
              <span>WhatsApp Us</span>
            </a>

            {/* Instant Quotation / Price Estimate View */}
            <button
              onClick={onOpenEstimate}
              className="hidden sm:flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-xl text-xs font-semibold border border-white/20 transition-all shadow-sm shrink-0"
              id="nav-estimate-btn"
              title="View Price Estimate Quotation"
            >
              <FileText className="w-3.5 h-3.5 text-amber-300" />
              <span>Estimate Sheet</span>
            </button>

            {/* Sleek Cart Widget */}
            <button
              onClick={onOpenCart}
              className="bg-white/10 hover:bg-white/20 px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl border border-white/20 flex items-center gap-1.5 sm:gap-2.5 transition-all cursor-pointer active:scale-95 text-left shrink-0"
              id="nav-cart-btn"
              title="View Shopping Cart"
            >
              <div className="relative flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 sm:w-5 sm:h-5 text-white" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-400 text-red-950 text-[10px] font-black px-1.5 py-0.2 rounded-full min-w-[17px] text-center shadow leading-tight">
                    {totalItems}
                  </span>
                )}
              </div>
              <div className="text-xs hidden sm:block">
                <p className="opacity-80 text-[10px] uppercase font-bold tracking-tight leading-none">My Cart</p>
                <p className="font-black text-xs text-amber-300 leading-tight mt-0.5">₹ {totalAmount.toLocaleString('en-IN')}</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Sleek Category Filter Chips Bar - hidden in mobile view as requested */}
      <div
        className="hidden md:block bg-white border-b border-slate-200 px-3 sm:px-6 py-2 overflow-x-auto no-scrollbar shadow-xs w-full"
        id="category-scroll-bar"
      >
        <div className="max-w-7xl mx-auto flex items-center gap-2 min-w-max">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs transition-all flex items-center gap-1.5 border shrink-0 ${
                  isSelected
                    ? 'bg-red-50 text-red-700 border-red-200 font-bold shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200 font-medium'
                }`}
                id={`cat-pill-${cat.id}`}
              >
                {cat.id === 'all' && <Sparkles className="w-3 h-3 text-amber-500" />}
                <span>{cat.name}</span>
                <span className={`text-[10px] ${isSelected ? 'text-red-700 font-bold' : 'text-slate-400'}`}>
                  • {cat.tamilName}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
