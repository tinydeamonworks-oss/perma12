import React from 'react';
import { MapPin, Phone, MessageSquare, Clock, Navigation, CheckCircle2, ShieldCheck, Car, Building2 } from 'lucide-react';

export const StoreLocation: React.FC = () => {
  const mapAddressQuery = encodeURIComponent(
    'No. 26, Mariyamman Kovil Street, N.R. Palayam, Ariyankuppam Post, Cuddalore Taluk, Tamil Nadu - 605007'
  );

  return (
    <section className="py-12 bg-slate-50 text-slate-900 border-t border-slate-200" id="store-location-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-700 font-bold text-xs uppercase tracking-wider border border-red-100 mb-3">
            <MapPin className="w-3.5 h-3.5" />
            <span>Visit Our Exclusive Showroom</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 uppercase">
            Prema Fireworks – Cuddalore
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Experience Cuddalore's most trusted fireworks showroom at Mariyamman Kovil Street, N.R. Palayam with over 150+ varieties directly from Sivakasi factories.
          </p>
        </div>

        {/* Store Information Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Main Address & Contact Card */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between" id="showroom-address-card">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-2xl bg-red-700 text-white font-black">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-red-700">Exclusive Showroom</span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                    PREMA FIREWORKS
                  </h3>
                </div>
              </div>

              {/* Exact Address from user image */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div className="text-sm text-slate-700">
                    <p className="font-extrabold text-slate-900 text-base">
                      No. 26, Mariyamman Kovil Street
                    </p>
                    <p className="mt-0.5 text-slate-600">
                      N.R. Palayam <strong className="text-red-700">(On the way to Aatru)</strong>
                    </p>
                    <p className="font-semibold text-slate-800">
                      Ariyankuppam Post, Cuddalore T.K. – 605007
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span>Open 7 Days: <strong>9:00 AM – 10:00 PM</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                    <Car className="w-4 h-4 text-slate-600" />
                    <span>Spacious Car & Bike Parking</span>
                  </div>
                </div>
              </div>

              {/* Contact numbers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                <a
                  href="tel:9600830112"
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-red-50 hover:bg-red-100/80 border border-red-100 text-red-950 transition-colors"
                >
                  <Phone className="w-5 h-5 text-red-700" />
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Direct Hotline</span>
                    <strong className="text-base text-slate-900 font-mono">9600830112</strong>
                  </div>
                </a>

                <a
                  href="tel:9626200112"
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-red-50 hover:bg-red-100/80 border border-red-100 text-red-950 transition-colors"
                >
                  <Phone className="w-5 h-5 text-red-700" />
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Alternate Number</span>
                    <strong className="text-base text-slate-900 font-mono">9626200112</strong>
                  </div>
                </a>

                <a
                  href="https://wa.me/919600830112?text=Hi%20Prema%20Fireworks%2C%20I%20want%20to%20visit%20your%20showroom%20in%20Ariyankuppam%2C%20Cuddalore."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sm:col-span-2 flex items-center gap-3 p-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-100 text-emerald-950 transition-colors"
                >
                  <MessageSquare className="w-5 h-5 text-emerald-600" />
                  <div>
                    <span className="text-[10px] text-emerald-700 uppercase font-bold block">WhatsApp Inquiry</span>
                    <strong className="text-base text-slate-900 font-mono">9600830112</strong>
                  </div>
                </a>
              </div>
            </div>

            {/* Quick Direction Actions */}
            <div className="flex flex-wrap items-center gap-3 mt-6 pt-4 border-t border-slate-100">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${mapAddressQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[200px] bg-red-700 hover:bg-red-800 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95 text-xs sm:text-sm uppercase tracking-wider"
              >
                <Navigation className="w-4 h-4" />
                <span>Get Google Maps Directions</span>
              </a>

              <a
                href="tel:9600830112"
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>Call Store</span>
              </a>
            </div>
          </div>

          {/* Right Highlights & Features */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            {/* Why Buy From Prema Fireworks */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h4 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green-600" />
                <span>Why Prema Fireworks?</span>
              </h4>

              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span><strong>100% Sivakasi Direct Factory Rates:</strong> No middlemen, honest pricing straight from the source.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span><strong>Safe Green Crackers:</strong> Authorized formulation with reduced emissions & safe fuse standards.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span><strong>Special Gift Box Assortments:</strong> Pre-assembled festive packages for budget of any size.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span><strong>Convenient Town Location:</strong> Located on N.R. Palayam - Ariyankuppam route, on the way to Aatru, with easy parking.</span>
                </li>
              </ul>
            </div>

            {/* Festive Wish */}
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-5 rounded-2xl text-white text-center shadow-sm">
              <span className="text-2xl">🪔 🎆 ✨</span>
              <h5 className="text-sm sm:text-base font-bold text-white mt-1">
                Happy & Prosperous Festive Celebrations!
              </h5>
              <p className="text-xs text-white/90 mt-1">
                Let every spark bring joy and every burst light up your home with prosperity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

