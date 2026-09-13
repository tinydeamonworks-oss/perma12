import React from 'react';
import { BrandLogo } from './BrandLogo';
import { Phone, MessageSquare, MapPin, Sparkles } from 'lucide-react';

interface FooterProps {
  onSelectCategory: (id: string) => void;
  onOpenEstimate: () => void;
  categories: { id: string; name: string; tamilName: string }[];
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenEstimate,
  categories,
}) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-24 sm:pb-12" id="main-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-10">
          {/* Brand & Tagline */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <BrandLogo size="lg" textColor="light" />
            <p className="text-xs sm:text-sm text-slate-400 mt-4 leading-relaxed max-w-sm">
              Prema Fireworks is Cuddalore's trusted fireworks manufacturer & showroom at N.R. Palayam, Ariyankuppam. We bring you direct Sivakasi factory prices on supreme quality green crackers, at the best rates in town.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <a
                href="https://wa.me/919600830112"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-2 transition-colors uppercase tracking-wider"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp: 9600830112</span>
              </a>

              <a
                href="tel:9600830112"
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-2 border border-slate-700 transition-colors uppercase tracking-wider"
              >
                <Phone className="w-3.5 h-3.5 text-red-500" />
                <span>Call Store</span>
              </a>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-red-500" />
              <span>Product Categories</span>
            </h4>
            <ul className="space-y-2 text-xs">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => onSelectCategory(cat.id)}
                    className="text-slate-400 hover:text-white transition-colors text-left flex items-center justify-between w-full"
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] text-slate-500">{cat.tamilName}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Showroom Address & Timings */}
          <div className="lg:col-span-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-red-500" />
              <span>Showroom Address</span>
            </h4>

            <div className="text-xs text-slate-300 space-y-2 leading-relaxed bg-slate-800/80 p-4 rounded-xl border border-slate-700/80">
              <p className="font-bold text-white">
                Exclusive Showroom: PREMA FIREWORKS
              </p>
              <p className="text-slate-400 text-[11px]">
                Proprietor: D. Seetharaman
              </p>
              <p className="text-slate-300">
                No. 26, Mariyamman Kovil Street,<br />
                N.R. Palayam, Ariyankuppam Post,<br />
                Cuddalore T.K., Tamil Nadu - 605007<br />
                (On the way to Aatru)
              </p>
              <p className="pt-2 border-t border-slate-700 text-amber-400 font-mono font-bold">
                Cell: 9600830112 / 9626200112
              </p>
              <p className="text-[11px] text-emerald-400">
                Showroom Timings: 9:00 AM to 10:00 PM (Daily)
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Prema Fireworks - Light Up Your Celebrations. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <button onClick={onOpenEstimate} className="hover:text-slate-300 transition-colors">
              Estimate Calculator
            </button>
            <span>•</span>
            <a href="tel:9600830112" className="hover:text-slate-300 transition-colors">
              Help & Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

