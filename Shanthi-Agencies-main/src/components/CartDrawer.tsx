import React, { useState, useMemo } from 'react';
import { CartItem, OfferMilestone, CustomerOrderInfo } from '../types';
import { INDIA_STATES_AND_DISTRICTS } from '../data/statesAndDistricts';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  MessageSquare,
  FileText,
  ShieldCheck,
  AlertCircle,
  MapPin,
  User,
  Phone,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { getProductRealImageUrl } from '../utils/productImages';
import { downloadElementByIdAsPdf } from '../utils/pdfExport';

// Minimum order value rules
const MIN_ORDER_TAMIL_NADU = 2500;
const MIN_ORDER_OTHER_STATES = 5000;

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, newQty: number) => void;
  onClearCart: () => void;
  onOpenEstimate: () => void;
  milestones: OfferMilestone[];
  customerInfo: CustomerOrderInfo;
  onCustomerInfoChange: (info: CustomerOrderInfo) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onClearCart,
  onOpenEstimate,
  milestones,
  customerInfo,
  onCustomerInfoChange,
}) => {
  const [showOrderForm, setShowOrderForm] = useState(true);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSendingOrder, setIsSendingOrder] = useState(false);

  const currentState = customerInfo.state || 'Tamil Nadu';
  const availableDistricts = useMemo(() => {
    const found = INDIA_STATES_AND_DISTRICTS.find((s) => s.state === currentState);
    return found ? found.districts : ['Other District / City'];
  }, [currentState]);

  if (!isOpen) return null;

  const totalMrp = cartItems.reduce((sum, item) => sum + item.product.mrp * item.quantity, 0);
  const totalAmount = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalSavings = totalMrp - totalAmount;
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Active rewards
  const unlockedRewards = milestones.filter((m) => totalAmount >= m.minAmount);
  const nextMilestone = milestones.find((m) => totalAmount < m.minAmount);

  // Form Validation - Compulsory fields check
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!customerInfo.name || !customerInfo.name.trim()) {
      errors.name = 'Name is required / பெயர் கட்டாயம்';
    }

    const cleanPhone = (customerInfo.phone || '').replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      errors.phone = 'Valid 10-digit WhatsApp number is required';
    }

    if (!customerInfo.addressLine1 || !customerInfo.addressLine1.trim()) {
      errors.addressLine1 = 'Address Line 1 is required / கதவு எண், தெரு கட்டாயம்';
    }

    if (!customerInfo.addressLine2 || !customerInfo.addressLine2.trim()) {
      errors.addressLine2 = 'Address Line 2 is required / பகுதி, ஊர் கட்டாயம்';
    }

    if (!customerInfo.state || !customerInfo.state.trim()) {
      errors.state = 'Select state / மாநிலம் தேர்ந்தெடுக்கவும்';
    }

    if (!customerInfo.district || !customerInfo.district.trim()) {
      errors.district = 'Select district / மாவட்டம் தேர்ந்தெடுக்கவும்';
    }

    const cleanPin = (customerInfo.pincode || '').replace(/\D/g, '');
    if (!cleanPin || cleanPin.length < 6) {
      errors.pincode = 'Valid 6-digit PIN code required / பின்கோட் கட்டாயம்';
    }

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      setShowOrderForm(true);
      setGeneralError('⚠️ Please complete all required customer & delivery details below.');
      return false;
    }

    // Minimum order value check: ₹2,500 for Tamil Nadu, ₹5,000 for other states
    const isTamilNadu = (customerInfo.state || 'Tamil Nadu').trim().toLowerCase() === 'tamil nadu';
    const minOrderRequired = isTamilNadu ? MIN_ORDER_TAMIL_NADU : MIN_ORDER_OTHER_STATES;
    if (totalAmount < minOrderRequired) {
      setGeneralError(
        `⚠️ Minimum order value for ${isTamilNadu ? 'Tamil Nadu' : customerInfo.state} is ₹${minOrderRequired.toLocaleString('en-IN')}. ` +
        `Your current total is ₹${totalAmount.toLocaleString('en-IN')} — please add ₹${(minOrderRequired - totalAmount).toLocaleString('en-IN')} more to proceed.`
      );
      return false;
    }

    setGeneralError(null);
    return true;
  };

  const handleFieldChange = (field: keyof CustomerOrderInfo, value: string) => {
    onCustomerInfoChange({ ...customerInfo, [field]: value });
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
    if (generalError) {
      setGeneralError(null);
    }
  };

  const generateWhatsAppMessage = () => {
    let msg = `🎇 *PREMA FIREWORKS - FIREWORKS ORDER ENQUIRY* 🎇\n`;
    msg += `📍 *Showroom:* No. 26, Mariyamman Kovil Street, N.R. Palayam, Ariyankuppam, Cuddalore\n`;
    msg += `--------------------------------------------\n`;
    msg += `👤 *Customer Name:* ${customerInfo.name.trim()}\n`;
    msg += `📱 *WhatsApp Number:* ${customerInfo.phone.trim()}\n`;
    msg += `🏠 *Address Line 1:* ${customerInfo.addressLine1.trim()}\n`;
    msg += `🏘️ *Address Line 2:* ${customerInfo.addressLine2.trim()}\n`;
    msg += `🏛️ *State:* ${customerInfo.state || 'Tamil Nadu'}\n`;
    msg += `📍 *District:* ${customerInfo.district}\n`;
    msg += `📮 *PIN Code:* ${customerInfo.pincode.trim()}\n`;
    if (customerInfo.notes && customerInfo.notes.trim()) {
      msg += `📝 *Special Notes:* ${customerInfo.notes.trim()}\n`;
    }
    msg += `--------------------------------------------\n`;
    msg += `📦 *ITEMIZED ORDER LIST:*\n`;

    cartItems.forEach((item, idx) => {
      const lineTotal = item.product.price * item.quantity;
      msg += `${idx + 1}. ${item.product.name} (${item.product.tamilName})\n`;
      msg += `   Qty: ${item.quantity} ${item.product.unit} @ ₹${item.product.price} = *₹${lineTotal.toLocaleString('en-IN')}*\n`;
    });

    msg += `--------------------------------------------\n`;
    msg += `📊 *Total Items:* ${totalQuantity} Boxes\n`;
    msg += `🏷️ *Total MRP:* ₹${totalMrp.toLocaleString('en-IN')}\n`;
    msg += `🎉 *Total Savings:* ₹${totalSavings.toLocaleString('en-IN')}\n`;
    msg += `💰 *FINAL ESTIMATE AMOUNT:* *₹${totalAmount.toLocaleString('en-IN')}*\n`;

    if (unlockedRewards.length > 0) {
      msg += `🎁 *Eligible Free Gift Rewards:*\n`;
      unlockedRewards.forEach((r) => {
        msg += `   - ${r.rewardTitle} (${r.rewardDescription})\n`;
      });
    }

    msg += `--------------------------------------------\n`;
    msg += `Please confirm my order availability and payment/pickup details. Thank you!`;

    return encodeURIComponent(msg);
  };

  const handleWhatsAppCheckout = async () => {
    if (cartItems.length === 0 || isSendingOrder) return;
    if (!validateForm()) return;

    setIsSendingOrder(true);

    // Auto-download a PDF copy of the bill/estimate before sending the order,
    // so the customer always has a saved record even before WhatsApp opens.
    try {
      const orderRef = `PREMA-${Date.now()}`;
      await downloadElementByIdAsPdf('printable-estimate-content', `Prema-Fireworks-Bill-${orderRef}.pdf`);
    } catch (err) {
      console.error('Bill PDF auto-download failed:', err);
      // Don't block the order flow if PDF generation fails for any reason.
    }

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {}

    const encoded = generateWhatsAppMessage();
    window.open(`https://wa.me/919600830112?text=${encoded}`, '_blank');

    // Order sent — clear the cart and close the drawer so it's ready for a fresh order.
    onClearCart();
    setIsSendingOrder(false);
    onClose();
  };

  const handleOpenEstimateClick = () => {
    if (cartItems.length === 0) return;
    if (!validateForm()) return;
    onOpenEstimate();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end" id="cart-drawer-overlay">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-lg bg-white border-l border-slate-200 text-slate-900 shadow-2xl flex flex-col h-full z-10">
        {/* Drawer Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-700 text-white font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight text-white uppercase">
                Your Fireworks Cart
              </h2>
              <p className="text-xs text-slate-300">
                {totalQuantity} items • Total:{' '}
                <strong className="text-amber-400">₹{totalAmount.toLocaleString('en-IN')}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cartItems.length > 0 && (
              <button
                onClick={onClearCart}
                className="bg-red-950/80 hover:bg-red-800 text-red-200 hover:text-white px-2.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-all font-bold border border-red-700/50 shadow-xs cursor-pointer"
                title="Delete all items from cart"
                id="cart-delete-all-btn"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-400" />
                <span>Delete All</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3" id="cart-items-scrollable-list">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
              </div>
              <h3 className="font-bold text-slate-800 text-base mb-1">Your cart is empty</h3>
              <p className="text-xs text-slate-500 max-w-xs mb-5">
                Browse our Sivakasi fireworks price list and add your favorite crackers to calculate instant festive discounts!
              </p>
              <button
                onClick={onClose}
                className="bg-red-700 hover:bg-red-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-sm transition-transform active:scale-95 cursor-pointer"
              >
                Start Adding Fireworks
              </button>
            </div>
          ) : (
            cartItems.map(({ product, quantity }) => {
              const lineTotal = product.price * quantity;
              return (
                <div
                  key={product.id}
                  className="bg-white border border-slate-200 rounded-2xl p-3 flex gap-3 shadow-2xs items-center justify-between"
                  id={`cart-item-${product.id}`}
                >
                  <img
                    src={getProductRealImageUrl(product)}
                    alt={product.name}
                    className="w-14 h-14 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80';
                    }}
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 text-xs truncate">{product.name}</h4>
                    <p className="text-[11px] text-slate-500 truncate">{product.tamilName}</p>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">{product.unit}</p>

                    <div className="flex items-baseline gap-1.5 mt-1">
                      <span className="font-black text-xs text-red-600">₹{product.price}</span>
                      {product.discountPercent > 0 && (
                        <span className="text-[10px] text-slate-400 line-through">₹{product.mrp}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className="font-black text-xs text-slate-900">
                      ₹{lineTotal.toLocaleString('en-IN')}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
                        <button
                          onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                          className="w-6 h-6 rounded bg-white hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center font-bold text-xs text-slate-800">
                          {quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                          className="w-6 h-6 rounded bg-red-700 hover:bg-red-800 text-white font-bold flex items-center justify-center text-xs cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => onUpdateQuantity(product.id, 0)}
                        className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-600 text-red-600 hover:text-white flex items-center justify-center transition-colors border border-red-200 cursor-pointer"
                        title="Remove item"
                        aria-label={`Remove ${product.name} from cart`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Customer Details Form (COMPULSORY) & Price Summary */}
        {cartItems.length > 0 && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 max-h-[55vh] overflow-y-auto">
            {/* Compulsory Header */}
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-600"></span>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Customer & Delivery Details
                </h3>
                <span className="bg-red-100 text-red-700 text-[10px] font-black px-2 py-0.5 rounded-full border border-red-200">
                  * Compulsory / கட்டாயம்
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowOrderForm(!showOrderForm)}
                className="text-xs text-slate-500 hover:text-slate-800 font-bold cursor-pointer"
              >
                {showOrderForm ? '▲ Hide' : '▼ View Form'}
              </button>
            </div>

            {generalError && (
              <div className="mb-2.5 p-2 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700 font-semibold">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{generalError}</span>
              </div>
            )}

            {showOrderForm && (
              <div className="space-y-2.5 mb-3 text-xs" id="customer-compulsory-form">
                {/* 1. Name & WhatsApp Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Your Name / பெயர் <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="e.g. Ramesh Kumar"
                        value={customerInfo.name || ''}
                        onChange={(e) => handleFieldChange('name', e.target.value)}
                        className={`w-full bg-white text-slate-900 rounded-xl p-2.5 text-xs border shadow-2xs focus:outline-none ${
                          validationErrors.name
                            ? 'border-red-500 ring-2 ring-red-100 bg-red-50/20'
                            : 'border-slate-200 focus:border-red-600'
                        }`}
                        id="order-customer-name"
                      />
                    </div>
                    {validationErrors.name && (
                      <p className="text-[10px] text-red-600 font-bold mt-0.5">{validationErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      WhatsApp Number / எண் <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="10-digit WhatsApp number"
                        value={customerInfo.phone || ''}
                        onChange={(e) => handleFieldChange('phone', e.target.value.replace(/\D/g, ''))}
                        className={`w-full bg-white text-slate-900 rounded-xl p-2.5 text-xs border shadow-2xs focus:outline-none ${
                          validationErrors.phone
                            ? 'border-red-500 ring-2 ring-red-100 bg-red-50/20'
                            : 'border-slate-200 focus:border-red-600'
                        }`}
                        id="order-customer-phone"
                      />
                    </div>
                    {validationErrors.phone && (
                      <p className="text-[10px] text-red-600 font-bold mt-0.5">{validationErrors.phone}</p>
                    )}
                  </div>
                </div>

                {/* 2. Address Line 1 (Door No, Street Name) */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Address Line 1 / கதவு எண், தெரு முகவரி <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Door No, Street Name (e.g. No. 14, Gandhi Street)"
                    value={customerInfo.addressLine1 || ''}
                    onChange={(e) => handleFieldChange('addressLine1', e.target.value)}
                    className={`w-full bg-white text-slate-900 rounded-xl p-2.5 text-xs border shadow-2xs focus:outline-none ${
                      validationErrors.addressLine1
                        ? 'border-red-500 ring-2 ring-red-100 bg-red-50/20'
                        : 'border-slate-200 focus:border-red-600'
                    }`}
                    id="order-address-line-1"
                  />
                  {validationErrors.addressLine1 && (
                    <p className="text-[10px] text-red-600 font-bold mt-0.5">{validationErrors.addressLine1}</p>
                  )}
                </div>

                {/* 3. Address Line 2 (Area, Landmark / Town) */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Address Line 2 / பகுதி, ஊர், லேண்ட்மார்க் <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Area, Village / Landmark (e.g. Near Mariyamman Temple, Ariyankuppam)"
                    value={customerInfo.addressLine2 || ''}
                    onChange={(e) => handleFieldChange('addressLine2', e.target.value)}
                    className={`w-full bg-white text-slate-900 rounded-xl p-2.5 text-xs border shadow-2xs focus:outline-none ${
                      validationErrors.addressLine2
                        ? 'border-red-500 ring-2 ring-red-100 bg-red-50/20'
                        : 'border-slate-200 focus:border-red-600'
                    }`}
                    id="order-address-line-2"
                  />
                  {validationErrors.addressLine2 && (
                    <p className="text-[10px] text-red-600 font-bold mt-0.5">{validationErrors.addressLine2}</p>
                  )}
                </div>

                {/* 4. State & District Dropdowns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      State / மாநிலம் <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={customerInfo.state || 'Tamil Nadu'}
                      onChange={(e) => {
                        const newState = e.target.value;
                        const stateObj = INDIA_STATES_AND_DISTRICTS.find((s) => s.state === newState);
                        const firstDistrict = stateObj && stateObj.districts.length > 0 ? stateObj.districts[0] : '';
                        onCustomerInfoChange({
                          ...customerInfo,
                          state: newState,
                          district: firstDistrict,
                        });
                        if (validationErrors.state || validationErrors.district) {
                          setValidationErrors((prev) => {
                            const updated = { ...prev };
                            delete updated.state;
                            delete updated.district;
                            return updated;
                          });
                        }
                      }}
                      className={`w-full bg-white text-slate-900 rounded-xl p-2.5 text-xs border shadow-2xs focus:outline-none cursor-pointer ${
                        validationErrors.state
                          ? 'border-red-500 ring-2 ring-red-100 bg-red-50/20'
                          : 'border-slate-200 focus:border-red-600'
                      }`}
                      id="order-customer-state"
                    >
                      <option value="">-- Select State / மாநிலம் --</option>
                      {INDIA_STATES_AND_DISTRICTS.map((s) => (
                        <option key={s.state} value={s.state}>
                          {s.state} {s.tamilState ? `(${s.tamilState})` : ''}
                        </option>
                      ))}
                    </select>
                    {validationErrors.state && (
                      <p className="text-[10px] text-red-600 font-bold mt-0.5">{validationErrors.state}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      District / மாவட்டம் <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={customerInfo.district || ''}
                      onChange={(e) => handleFieldChange('district', e.target.value)}
                      className={`w-full bg-white text-slate-900 rounded-xl p-2.5 text-xs border shadow-2xs focus:outline-none cursor-pointer ${
                        validationErrors.district
                          ? 'border-red-500 ring-2 ring-red-100 bg-red-50/20'
                          : 'border-slate-200 focus:border-red-600'
                      }`}
                      id="order-customer-district"
                    >
                      <option value="">-- Select District / மாவட்டம் --</option>
                      {availableDistricts.map((districtName) => (
                        <option key={districtName} value={districtName}>
                          {districtName}
                        </option>
                      ))}
                    </select>
                    {validationErrors.district && (
                      <p className="text-[10px] text-red-600 font-bold mt-0.5">{validationErrors.district}</p>
                    )}
                  </div>
                </div>

                {/* 5. PIN Code */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    PIN Code / பின்கோட் <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="6-digit Postal PIN Code (e.g. 605007)"
                    value={customerInfo.pincode || ''}
                    onChange={(e) => handleFieldChange('pincode', e.target.value.replace(/\D/g, ''))}
                    className={`w-full bg-white text-slate-900 rounded-xl p-2.5 text-xs border shadow-2xs focus:outline-none ${
                      validationErrors.pincode
                        ? 'border-red-500 ring-2 ring-red-100 bg-red-50/20'
                        : 'border-slate-200 focus:border-red-600'
                    }`}
                    id="order-customer-pincode"
                  />
                  {validationErrors.pincode && (
                    <p className="text-[10px] text-red-600 font-bold mt-0.5">{validationErrors.pincode}</p>
                  )}
                </div>

                {/* 5. Special Notes (Optional) */}
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 mb-1">
                    Special instructions / குறிப்புகள் (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Prefer pickup on Saturday evening"
                    value={customerInfo.notes || ''}
                    onChange={(e) => handleFieldChange('notes', e.target.value)}
                    className="w-full bg-white text-slate-800 rounded-xl p-2.5 text-xs border border-slate-200 focus:border-red-600 focus:outline-none shadow-2xs"
                    id="order-special-notes"
                  />
                </div>
              </div>
            )}

            {/* Price Calculations Summary */}
            <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500">Total MRP Value:</span>
                <span className="line-through text-slate-400">₹{totalMrp.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-green-700 font-bold">
                <span>Discount:</span>
                <span>- ₹{totalSavings.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-slate-200 text-slate-900">
                <span className="font-extrabold text-sm sm:text-base">Estimated Net Total:</span>
                <span className="font-black text-xl text-red-600">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
              {(() => {
                const isTamilNadu = (customerInfo.state || 'Tamil Nadu').trim().toLowerCase() === 'tamil nadu';
                const minOrderRequired = isTamilNadu ? MIN_ORDER_TAMIL_NADU : MIN_ORDER_OTHER_STATES;
                const shortfall = minOrderRequired - totalAmount;
                if (shortfall <= 0) return null;
                return (
                  <p className="text-[10.5px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5 font-semibold">
                    ℹ️ Minimum order for {isTamilNadu ? 'Tamil Nadu' : (customerInfo.state || 'other states')} is ₹{minOrderRequired.toLocaleString('en-IN')}.
                    Add ₹{shortfall.toLocaleString('en-IN')} more to place this order.
                  </p>
                );
              })()}
            </div>

            {/* Action Buttons: WhatsApp Checkout + PDF Estimate */}
            <div className="grid grid-cols-2 gap-2 mt-3.5">
              <button
                onClick={handleOpenEstimateClick}
                className="col-span-1 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 text-xs transition-colors shadow-2xs cursor-pointer"
                id="cart-view-quotation-btn"
                title="View & print official estimate sheet"
              >
                <FileText className="w-3.5 h-3.5 text-slate-600" />
                <span>Estimate Bill</span>
              </button>

              <button
                onClick={handleWhatsAppCheckout}
                disabled={isSendingOrder}
                className="col-span-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-70 disabled:cursor-wait text-white font-black py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 text-xs shadow-md transition-transform active:scale-95 cursor-pointer"
                id="cart-whatsapp-order-btn"
                title="Submit order directly via WhatsApp"
              >
                <MessageSquare className="w-4 h-4 text-emerald-100" />
                <span>{isSendingOrder ? 'Preparing Bill...' : 'WhatsApp Order'}</span>
              </button>
            </div>

            <p className="text-[10px] text-slate-500 text-center mt-2 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
              <span>Direct Showroom Pickup & Safe Packing from Ariyankuppam, Cuddalore</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
