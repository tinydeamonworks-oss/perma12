import React from 'react';
import { Gift, Sparkles, Trophy, CheckCircle2, ChevronRight, Zap } from 'lucide-react';
import { OfferMilestone } from '../types';

interface FestiveOffersProps {
  currentTotal: number;
  milestones: OfferMilestone[];
  onOpenCart: () => void;
}

export const FestiveOffers: React.FC<FestiveOffersProps> = ({
  currentTotal,
  milestones,
  onOpenCart,
}) => {
  // Find next milestone to unlock
  const nextMilestone = milestones.find((m) => currentTotal < m.minAmount);
  const highestUnlocked = [...milestones].reverse().find((m) => currentTotal >= m.minAmount);

  return (
    <section className="bg-slate-50 border-b border-slate-200 py-3 px-4 sm:px-6" id="festive-offers-bar">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Milestone Progress Info */}
          <div className="flex-1 w-full">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-red-50 text-red-700 border border-red-100">
                  <Trophy className="w-4 h-4" />
                </span>
                <span className="text-sm font-bold text-slate-800">
                  Complimentary Gift Rewards:
                </span>
                {highestUnlocked && (
                  <span className="bg-green-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                    <CheckCircle2 className="w-3 h-3" /> Unlocked: {highestUnlocked.rewardTitle}
                  </span>
                )}
              </div>

              {nextMilestone && (
                <span className="text-xs text-slate-600 font-medium">
                  Add <strong className="text-red-700 font-bold">₹{(nextMilestone.minAmount - currentTotal).toLocaleString('en-IN')}</strong> more to unlock <span className="text-slate-800 font-bold underline">{nextMilestone.rewardTitle}</span>!
                </span>
              )}
            </div>

            {/* Milestones Horizontal Tracker */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
              {milestones.map((milestone) => {
                const isUnlocked = currentTotal >= milestone.minAmount;
                const progress = Math.min(100, Math.round((currentTotal / milestone.minAmount) * 100));

                return (
                  <div
                    key={milestone.minAmount}
                    className={`relative p-3 rounded-xl border text-xs transition-all ${
                      isUnlocked
                        ? 'bg-red-50/70 border-red-200 text-red-950 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{milestone.icon}</span>
                        <div>
                          <p className={`font-bold ${isUnlocked ? 'text-red-700' : 'text-slate-800'}`}>
                            {milestone.rewardTitle}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            Orders ≥ ₹{milestone.minAmount.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                      {isUnlocked ? (
                        <span className="bg-red-700 text-white font-bold text-[10px] px-2 py-0.5 rounded-full">
                          Unlocked
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-mono font-bold">
                          {progress}%
                        </span>
                      )}
                    </div>

                    {/* Mini progress bar */}
                    <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isUnlocked ? 'bg-red-700' : 'bg-amber-500'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
