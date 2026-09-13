import React from 'react';
import { Check, X as CloseIcon, HeartHandshake } from 'lucide-react';

export const SafetyGuidelines: React.FC = () => {
  return (
    <section className="py-10 bg-white border-t border-slate-200" id="safety-guidelines-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider border border-emerald-100 mb-2">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Green Fireworks Safety</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 uppercase">
            Safe Celebration Guidelines / பாதுகாப்பு விதிகள்
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Enjoy safe and joyful festivities with your loved ones by following these essential safety recommendations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Do's */}
          <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-200 text-xs sm:text-sm">
            <h4 className="font-bold text-emerald-900 text-sm mb-3 flex items-center gap-2">
              <Check className="w-4 h-4 bg-emerald-600 text-white rounded-full p-0.5" />
              <span>DO'S / செய்ய வேண்டியவை</span>
            </h4>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Always ignite fireworks in open spaces away from buildings, vehicles, and dry grass.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Keep a bucket of water and sand nearby for emergency extinguishing.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Wear tight cotton clothes and footwear while bursting crackers.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Ensure an adult supervises children when lighting sparklers and flower pots.</span>
              </li>
            </ul>
          </div>

          {/* Don'ts */}
          <div className="bg-red-50/50 p-5 rounded-2xl border border-red-200 text-xs sm:text-sm">
            <h4 className="font-bold text-red-900 text-sm mb-3 flex items-center gap-2">
              <CloseIcon className="w-4 h-4 bg-red-600 text-white rounded-full p-0.5" />
              <span>DON'TS / செய்யக்கூடாதவை</span>
            </h4>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">✕</span>
                <span>Never light crackers inside the house or inside closed balconies.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">✕</span>
                <span>Never attempt to re-ignite a cracker that failed to go off. Wait 10 mins and douse in water.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">✕</span>
                <span>Do not hold flower pots or rockets in hand while igniting.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">✕</span>
                <span>Avoid wearing synthetic or loose flowing clothes near flames.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

