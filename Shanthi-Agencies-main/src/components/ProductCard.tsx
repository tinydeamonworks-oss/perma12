import React from 'react';
import { Product } from '../types';
import { Plus, Minus, ShoppingBag, Volume2, Eye, Flame, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getProductRealImageUrl } from '../utils/productImages';

interface ProductCardProps {
  product: Product;
  quantityInCart: number;
  onUpdateQuantity: (productId: string, newQty: number) => void;
  onAddToCart: (product: Product, qty: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  quantityInCart,
  onUpdateQuantity,
  onAddToCart,
}) => {
  const lineTotal = product.price * (quantityInCart > 0 ? quantityInCart : 1);
  const savings = (product.mrp - product.price) * (quantityInCart > 0 ? quantityInCart : 1);

  const handleIncrement = () => {
    const nextQty = (quantityInCart || 0) + 1;
    onUpdateQuantity(product.id, nextQty);
  };

  const handleDecrement = () => {
    if (quantityInCart > 0) {
      onUpdateQuantity(product.id, quantityInCart - 1);
    }
  };

  const handleQuickAdd = () => {
    onAddToCart(product, 1);
    try {
      confetti({
        particleCount: 20,
        spread: 45,
        origin: { y: 0.8 },
        colors: ['#b91c1c', '#f59e0b', '#10b981', '#ef4444'],
      });
    } catch {
      // safe fallback
    }
  };

  const handleDirectInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (isNaN(val) || val < 0) {
      onUpdateQuantity(product.id, 0);
    } else {
      onUpdateQuantity(product.id, Math.min(999, val));
    }
  };

  return (
    <div
      className="group relative flex flex-col bg-white border border-slate-200 rounded-2xl p-4 gap-3 shadow-sm hover:shadow-md transition-all duration-200"
      id={`product-card-${product.id}`}
    >
      {/* Product Image & Badges */}
      <div className="relative h-40 w-full bg-slate-100 rounded-xl flex items-center justify-center overflow-hidden">
        <img
          src={getProductRealImageUrl(product)}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // fallback to default firework photo if network glitch
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {/* Discount Badge */}
        {product.discountPercent > 0 && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            {product.discountPercent}% OFF
          </span>
        )}

        {/* Feature / Deal Badge */}
        {product.badge ? (
          <span className="absolute top-2 right-2 bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            {product.badge}
          </span>
        ) : (
          <span className="absolute top-2 right-2 bg-slate-800/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            INSTOCK
          </span>
        )}

        {/* Sound / Effect Tag */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-white/90 backdrop-blur-xs text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-xs">
          {product.soundLevel === 'Visual No-Sound' ? (
            <>
              <Eye className="w-3 h-3 text-emerald-600" />
              <span>Visual</span>
            </>
          ) : product.soundLevel === 'Musical' ? (
            <>
              <Flame className="w-3 h-3 text-amber-600" />
              <span>Whistle</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3 h-3 text-red-600" />
              <span>{product.soundLevel}</span>
            </>
          )}
        </div>

        {/* Unit Tag */}
        <div className="absolute bottom-2 right-2 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
          {product.unit}
        </div>
      </div>

      {/* Product Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h4 className="font-bold text-slate-800 text-sm sm:text-base leading-tight group-hover:text-red-700 transition-colors">
            {product.name}
          </h4>
          <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
            {product.tamilName} • {product.description}
          </p>
        </div>

        {/* Price & Savings */}
        <div className="mt-3 pt-2.5 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              {product.mrp > product.price && (
                <span className="text-xs text-slate-400 line-through decoration-red-500 font-medium">₹ {product.mrp}</span>
              )}
              <span className="text-lg font-black text-red-600 leading-tight">₹ {product.price}</span>
            </div>

            {quantityInCart > 0 ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleDecrement}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                <input
                  type="number"
                  min="0"
                  max="999"
                  value={quantityInCart}
                  onChange={handleDirectInput}
                  className="w-8 text-center font-bold text-sm text-slate-800 bg-transparent focus:outline-none"
                />

                <button
                  onClick={handleIncrement}
                  className="w-8 h-8 rounded-lg bg-red-700 hover:bg-red-800 text-white flex items-center justify-center font-bold transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : null}
          </div>

          {/* Add to Cart Button */}
          {quantityInCart === 0 ? (
            <button
              onClick={handleQuickAdd}
              className="w-full mt-3 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-xs flex items-center justify-center gap-1.5"
              id={`add-btn-${product.id}`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
              <span>Add to Cart</span>
            </button>
          ) : (
            <div className="mt-2.5 flex items-center justify-between text-[11px] bg-red-50 text-red-700 px-2.5 py-1 rounded-lg font-semibold border border-red-100">
              <span>{quantityInCart} in cart</span>
              <span>Total: ₹{(product.price * quantityInCart).toLocaleString('en-IN')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

