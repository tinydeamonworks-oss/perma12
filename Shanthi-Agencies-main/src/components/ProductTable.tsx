import React from 'react';
import { Product, Category } from '../types';
import { Plus, Minus, Sparkles } from 'lucide-react';
import { getProductRealImageUrl } from '../utils/productImages';

interface ProductTableProps {
  products: Product[];
  cartQuantities: Record<string, number>;
  onUpdateQuantity: (productId: string, newQty: number) => void;
  categories?: Category[];
  groupByCategory?: boolean;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  cartQuantities,
  onUpdateQuantity,
  categories = [],
  groupByCategory = true,
}) => {
  // Build category grouping
  const groupedSections = React.useMemo(() => {
    if (!groupByCategory || categories.length === 0) {
      return [{ category: null, items: products }];
    }

    const groups: { category: Category | null; items: Product[] }[] = [];

    // Group items preserving category order from CATEGORIES
    categories.forEach((cat) => {
      if (cat.id === 'all') return;
      const items = products.filter((p) => p.category === cat.id);
      if (items.length > 0) {
        groups.push({ category: cat, items });
      }
    });

    // Catch any items that might belong to unknown categories
    const handledIds = new Set(groups.flatMap((g) => g.items.map((i) => i.id)));
    const remaining = products.filter((p) => !handledIds.has(p.id));
    if (remaining.length > 0) {
      groups.push({ category: null, items: remaining });
    }

    return groups;
  }, [products, categories, groupByCategory]);

  return (
    <div className="w-full space-y-8" id="wholesale-price-table-container">
      {groupedSections.map((group, groupIdx) => (
        <section
          key={group.category?.id || `group-section-${groupIdx}`}
          className="space-y-3"
          id={group.category ? `table-category-section-${group.category.id}` : `table-category-section-${groupIdx}`}
        >
          {/* Category Section Header - Non-sticky so it NEVER overlaps */}
          {group.category && (
            <div className="flex items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-9 h-9 rounded-xl bg-red-700 text-amber-300 flex items-center justify-center font-black shadow-xs shrink-0">
                  <Sparkles className="w-5 h-5" />
                </span>
                <div className="min-w-0">
                  <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-slate-900 leading-tight truncate">
                    {group.category.name}
                  </h2>
                  <p className="text-xs sm:text-sm font-semibold text-red-700 truncate">
                    {group.category.tamilName}
                  </p>
                </div>
              </div>
              <span className="bg-red-50 text-red-700 border border-red-200 text-xs font-black px-3 py-1 rounded-full shrink-0">
                {group.items.length} Items
              </span>
            </div>
          )}

          {/* 1. Mobile Phone View (<640px): Cards layout without sticky overlap */}
          <div className="block sm:hidden space-y-2.5 w-full">
            {group.items.map((product, index) => {
              const qty = cartQuantities[product.id] || 0;
              const lineTotal = product.price * qty;

              return (
                <div
                  key={product.id}
                  className={`w-full p-2.5 rounded-xl border transition-all ${
                    qty > 0
                      ? 'bg-red-50/50 border-red-300 shadow-xs'
                      : 'bg-white border-slate-200 shadow-2xs'
                  }`}
                  id={`mobile-product-row-${product.id}`}
                >
                  {/* Top Row: Product Name, Tamil Name & Packing */}
                  <div className="flex items-center gap-2.5 w-full">
                    <img
                      src={getProductRealImageUrl(product)}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80';
                      }}
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="bg-slate-100 text-slate-700 text-[9px] font-bold px-1.5 py-0.5 rounded-md border border-slate-200 shrink-0">
                          {product.unit}
                        </span>
                      </div>

                      <h3 className="font-bold text-slate-900 text-xs sm:text-sm leading-tight truncate mt-0.5">
                        {product.name}
                      </h3>
                      <p className="text-slate-500 text-[11px] font-medium truncate">
                        {product.tamilName}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Combined Row: Price (Strikethrough MRP + Our Price) & Compact Stepper */}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 gap-2">
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className="text-sm font-black text-red-600">
                        ₹{product.price}
                      </span>
                      {product.mrp > product.price && (
                        <span className="text-xs text-slate-400 line-through decoration-red-500 decoration-1">
                          ₹{product.mrp}
                        </span>
                      )}
                      {product.discountPercent > 0 && (
                        <span className="text-[9px] bg-red-100 text-red-700 font-extrabold px-1 rounded">
                          {product.discountPercent}% OFF
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 bg-slate-50 rounded-lg border border-slate-200 p-0.5 shrink-0">
                      <button
                        onClick={() => {
                          if (qty > 0) onUpdateQuantity(product.id, qty - 1);
                        }}
                        className="w-6 h-6 rounded bg-white text-slate-700 border border-slate-200 flex items-center justify-center active:scale-95 transition-transform font-bold cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>

                      <input
                        type="number"
                        min="0"
                        max="999"
                        value={qty}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          onUpdateQuantity(product.id, isNaN(val) || val < 0 ? 0 : Math.min(999, val));
                        }}
                        className="w-7 text-center bg-transparent font-bold text-xs text-slate-800 focus:outline-none"
                      />

                      <button
                        onClick={() => onUpdateQuantity(product.id, qty + 1)}
                        className="w-6 h-6 rounded bg-red-700 text-white flex items-center justify-center active:scale-95 transition-transform font-bold cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {qty > 0 && (
                    <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-red-100 text-[11px]">
                      <span className="text-slate-500">Item Total:</span>
                      <span className="font-black text-red-700">₹{lineTotal.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 2. Desktop / Tablet Wholesale Table (>=640px) - Non-sticky clean header */}
          <div className="hidden sm:block w-full overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-2xs">
            <table className="w-full text-left text-xs sm:text-sm text-slate-700 border-collapse">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[11px] sm:text-xs border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3 text-center w-12">#</th>
                  <th className="py-3 px-3">Product Name & Variety</th>
                  <th className="py-3 px-3">Packing</th>
                  <th className="py-3 px-3 text-right">MRP (₹)</th>
                  <th className="py-3 px-3 text-right">Offer (₹)</th>
                  <th className="py-3 px-3 text-center min-w-[130px]">Quantity</th>
                  <th className="py-3 px-3 text-right">Total (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {group.items.map((product, index) => {
                  const qty = cartQuantities[product.id] || 0;
                  const lineTotal = product.price * qty;

                  return (
                    <tr
                      key={product.id}
                      className={`hover:bg-slate-50 transition-colors ${
                        qty > 0 ? 'bg-red-50/40' : ''
                      }`}
                      id={`table-row-${product.id}`}
                    >
                      {/* S.No */}
                      <td className="py-2.5 px-3 text-center font-mono text-slate-400">
                        {index + 1}
                      </td>

                      {/* Product Name & Tamil Title */}
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={getProductRealImageUrl(product)}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80';
                            }}
                          />
                          <div>
                            <div className="font-bold text-slate-800 flex items-center gap-1.5">
                              <span>{product.name}</span>
                              {product.featured && (
                                <span className="bg-red-600 text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-full">
                                  HOT
                                </span>
                              )}
                            </div>
                            <div className="text-slate-500 text-xs font-medium">
                              {product.tamilName}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Packing */}
                      <td className="py-2.5 px-3 text-slate-600 font-medium">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-xs border border-slate-200 text-slate-700">
                          {product.unit}
                        </span>
                      </td>

                      {/* MRP */}
                      <td className="py-2.5 px-3 text-right text-slate-400 line-through decoration-red-500 font-medium text-xs">
                        {product.mrp > product.price ? `₹${product.mrp}` : ''}
                      </td>

                      {/* Offer Price */}
                      <td className="py-2.5 px-3 text-right">
                        <span className="font-black text-red-600 text-sm sm:text-base">
                          ₹{product.price}
                        </span>
                        {product.discountPercent > 0 && (
                          <span className="block text-[10px] text-green-700 font-bold">
                            {product.discountPercent}% OFF
                          </span>
                        )}
                      </td>

                      {/* Quantity Controls */}
                      <td className="py-2.5 px-3">
                        <div className="flex items-center justify-center gap-1.5 max-w-[120px] mx-auto bg-slate-50 rounded-xl border border-slate-200 p-1">
                          <button
                            onClick={() => {
                              if (qty > 0) onUpdateQuantity(product.id, qty - 1);
                            }}
                            className="w-7 h-7 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center active:scale-95 transition-transform font-bold cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>

                          <input
                            type="number"
                            min="0"
                            max="999"
                            value={qty}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              onUpdateQuantity(product.id, isNaN(val) || val < 0 ? 0 : Math.min(999, val));
                            }}
                            className="w-8 text-center bg-transparent font-bold text-sm text-slate-800 focus:outline-none"
                          />

                          <button
                            onClick={() => onUpdateQuantity(product.id, qty + 1)}
                            className="w-7 h-7 rounded-lg bg-red-700 hover:bg-red-800 text-white flex items-center justify-center active:scale-95 transition-transform font-bold cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </td>

                      {/* Line Total */}
                      <td className="py-2.5 px-3 text-right font-black text-sm">
                        {qty > 0 ? (
                          <span className="text-red-700 font-black">
                            ₹{lineTotal.toLocaleString('en-IN')}
                          </span>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
};
