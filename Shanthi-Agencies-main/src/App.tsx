import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { FestiveOffers } from './components/FestiveOffers';
import { ProductCard } from './components/ProductCard';
import { ProductTable } from './components/ProductTable';
import { CartDrawer } from './components/CartDrawer';
import { EstimateModal } from './components/EstimateModal';
import { PriceListModal } from './components/PriceListModal';
import { StoreLocation } from './components/StoreLocation';
import { SafetyGuidelines } from './components/SafetyGuidelines';
import { Footer } from './components/Footer';
import { PRODUCTS, CATEGORIES, OFFER_MILESTONES } from './data/products';
import { Product, CartItem, CustomerOrderInfo, Category } from './types';
import {
  LayoutGrid,
  Table,
  ShoppingBag,
  ArrowUpRight,
  Flame,
  Percent,
  FileText,
  Search,
  X,
  Download,
  Filter,
  Sparkles,
  SlidersHorizontal,
  ChevronDown,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  // Cart state: productId -> quantity
  const [cartQuantities, setCartQuantities] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('prema_cart_state');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'discount'>('featured');
  const [cartDrawerOpen, setCartDrawerOpen] = useState<boolean>(false);
  const [estimateModalOpen, setEstimateModalOpen] = useState<boolean>(false);
  const [priceListModalOpen, setPriceListModalOpen] = useState<boolean>(false);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState<boolean>(false);

  const filterDropdownRef = useRef<HTMLDivElement>(null);

  // Close filter dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setFilterDropdownOpen(false);
      }
    }
    if (filterDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [filterDropdownOpen]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setFilterDropdownOpen(false);
      }
    }
    if (filterDropdownOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [filterDropdownOpen]);

  const [customerInfo, setCustomerInfo] = useState<CustomerOrderInfo>(() => {
    try {
      const saved = localStorage.getItem('prema_customer_info');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          name: parsed.name || '',
          phone: parsed.phone || '',
          addressLine1: parsed.addressLine1 || '',
          addressLine2: parsed.addressLine2 || '',
          state: parsed.state || 'Tamil Nadu',
          district: parsed.district || 'Cuddalore',
          pincode: parsed.pincode || '',
          notes: parsed.notes || '',
        };
      }
    } catch {}
    return {
      name: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      state: 'Tamil Nadu',
      district: 'Cuddalore',
      pincode: '',
      notes: '',
    };
  });

  // Save cart to local storage for persistence during browsing
  useEffect(() => {
    try {
      localStorage.setItem('prema_cart_state', JSON.stringify(cartQuantities));
    } catch {}
  }, [cartQuantities]);

  // Save customer info
  useEffect(() => {
    try {
      localStorage.setItem('prema_customer_info', JSON.stringify(customerInfo));
    } catch {}
  }, [customerInfo]);

  // Cart item objects
  const cartItems: CartItem[] = useMemo(() => {
    return (Object.entries(cartQuantities) as [string, number][])
      .filter(([_, qty]) => typeof qty === 'number' && qty > 0)
      .map(([id, qty]) => {
        const product = PRODUCTS.find((p) => p.id === id);
        return product ? { product, quantity: qty } : null;
      })
      .filter((item): item is CartItem => item !== null);
  }, [cartQuantities]);

  // Totals calculations
  const totalItems = useMemo(() => {
    return (Object.values(cartQuantities) as number[]).reduce((sum: number, q: number) => sum + (q || 0), 0);
  }, [cartQuantities]);

  const totalAmount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cartItems]);

  const totalMrp = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.product.mrp * item.quantity, 0);
  }, [cartItems]);

  const totalSavings = totalMrp - totalAmount;

  // Category item counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: PRODUCTS.length };
    PRODUCTS.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, []);

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Category filter
      const matchesCat = selectedCategory === 'all' || product.category === selectedCategory;

      // Search filter
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.tamilName.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q);

      return matchesCat && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'discount') return b.discountPercent - a.discountPercent;
      // Default: featured first
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }, [selectedCategory, searchQuery, sortBy]);

  // Group filtered products by category for sectioned view
  const groupedProducts = useMemo(() => {
    const groups: { category: Category; items: Product[] }[] = [];
    CATEGORIES.forEach((cat) => {
      if (cat.id === 'all') return;
      // If a specific category is selected, only show that category
      if (selectedCategory !== 'all' && cat.id !== selectedCategory) return;
      const items = filteredProducts.filter((p) => p.category === cat.id);
      if (items.length > 0) {
        groups.push({ category: cat, items });
      }
    });
    return groups;
  }, [filteredProducts, selectedCategory]);

  const selectedCategoryObj = CATEGORIES.find((c) => c.id === selectedCategory);

  // Quantity updates
  const handleUpdateQuantity = (productId: string, newQty: number) => {
    setCartQuantities((prev) => {
      const updated = { ...prev };
      if (newQty <= 0) {
        delete updated[productId];
      } else {
        updated[productId] = newQty;
      }
      return updated;
    });
  };

  const handleAddToCart = (product: Product, qty: number = 1) => {
    setCartQuantities((prev) => ({
      ...prev,
      [product.id]: (prev[product.id] || 0) + qty,
    }));
  };

  const handleClearCart = () => {
    setCartQuantities({});
  };

  const handleQuickOrderScroll = () => {
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleToggleTableMode = () => {
    setViewMode('table');
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-red-600 selection:text-white overflow-x-hidden w-full">
      {/* Top Navigation */}
      <Navbar
        totalItems={totalItems}
        totalAmount={totalAmount}
        onOpenCart={() => setCartDrawerOpen(true)}
        onOpenEstimate={() => setEstimateModalOpen(true)}
        onOpenPriceList={() => setPriceListModalOpen(true)}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        categories={CATEGORIES}
        categoryCounts={categoryCounts}
      />

      {/* Hero Showcase with store banner theme */}
      <HeroBanner
        onQuickOrderClick={handleQuickOrderScroll}
        onViewPriceList={handleToggleTableMode}
      />

      {/* Realtime Festive Free Gifts / Rewards Milestones bar */}
      <FestiveOffers
        currentTotal={totalAmount}
        milestones={OFFER_MILESTONES}
        onOpenCart={() => setCartDrawerOpen(true)}
      />

      {/* Main Catalog Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8" id="catalog-section">
        {/* ========================================================================= */}
        {/* PRODUCTS KU MELA: SEARCH BAR & FILTERS SECTION                           */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-6 shadow-sm mb-6" id="product-search-and-filter-panel">
          {/* Top Row: Search Bar & Vertical Filter Dropdown Button on ONE SINGLE LINE on mobile */}
          <div className="flex flex-row items-center gap-2 sm:gap-3">
            {/* Search Input Bar */}
            <div className="relative flex-1 min-w-0" id="catalog-search-bar-wrapper">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search crackers / பட்டாசுகள்..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 hover:bg-white focus:bg-white text-slate-900 placeholder-slate-400 text-xs sm:text-base rounded-xl pl-9 sm:pl-12 pr-8 sm:pr-10 py-2.5 sm:py-3 border-2 border-slate-200 focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none shadow-inner transition-all font-medium truncate"
                id="catalog-search-input"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 sm:right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                  aria-label="Clear search"
                  id="catalog-search-clear-btn"
                >
                  <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              )}
            </div>

            {/* Filter Button right next to search bar on the same line */}
            <div className="relative shrink-0" ref={filterDropdownRef}>
              <button
                onClick={() => setFilterDropdownOpen((prev) => !prev)}
                className={`px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-1.5 sm:gap-2.5 shadow-sm border transition-all active:scale-95 uppercase tracking-wide cursor-pointer whitespace-nowrap ${
                  filterDropdownOpen || selectedCategory !== 'all'
                    ? 'bg-red-700 text-white border-red-700 ring-2 ring-red-200 shadow-md'
                    : 'bg-amber-400 hover:bg-amber-300 text-red-950 border-amber-300'
                }`}
                id="catalog-filter-dropdown-btn"
                aria-expanded={filterDropdownOpen}
                aria-haspopup="true"
                title="Filter by category / வகைகள்"
              >
                <Filter className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${filterDropdownOpen || selectedCategory !== 'all' ? 'text-amber-300' : 'text-red-950'}`} />
                <span className="flex items-center gap-1">
                  <span>Filter</span>
                  {selectedCategory !== 'all' ? (
                    <span className="bg-amber-400 text-red-950 font-black text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded">
                      {selectedCategoryObj?.name.split(' ')[0]}
                    </span>
                  ) : (
                    <span className="hidden sm:inline text-[11px] opacity-80 font-semibold normal-case">
                      (வகைகள்)
                    </span>
                  )}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 ${
                    filterDropdownOpen ? 'rotate-180' : ''
                  } ${filterDropdownOpen || selectedCategory !== 'all' ? 'text-amber-300' : 'text-red-950'}`}
                />
              </button>

              {/* Vertical Filter Dropdown Menu - "fuliter click pana kila kila varunum one one ah show akunum" */}
              {filterDropdownOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
                  id="catalog-filter-dropdown-menu"
                >
                  {/* Dropdown Header */}
                  <div className="bg-slate-900 text-white p-3.5 px-4 flex items-center justify-between border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="text-xs font-black uppercase tracking-wider text-white">
                        Filter Category / வகைகள்
                      </span>
                    </div>
                    {selectedCategory !== 'all' && (
                      <button
                        onClick={() => {
                          setSelectedCategory('all');
                          setFilterDropdownOpen(false);
                        }}
                        className="text-[11px] text-amber-300 hover:text-white font-bold underline cursor-pointer"
                      >
                        Reset All
                      </button>
                    )}
                  </div>

                  {/* Vertical list of categories - "kila kila varunum one one ah show akunum" */}
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 py-1">
                    {CATEGORIES.map((cat) => {
                      const isSelected = selectedCategory === cat.id;
                      const count = categoryCounts[cat.id];
                      return (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setSelectedCategory(cat.id);
                            setFilterDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-red-50 text-red-700 font-bold'
                              : 'hover:bg-slate-50 text-slate-700 font-medium'
                          }`}
                          id={`catalog-dropdown-category-${cat.id}`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {cat.id === 'all' ? (
                              <Sparkles
                                className={`w-4 h-4 shrink-0 ${
                                  isSelected ? 'text-amber-500' : 'text-slate-400'
                                }`}
                              />
                            ) : (
                              <span
                                className={`w-2 h-2 rounded-full shrink-0 ${
                                  isSelected ? 'bg-red-600 ring-2 ring-red-200' : 'bg-slate-300'
                                }`}
                              />
                            )}
                            <div className="min-w-0">
                              <p className={`text-xs truncate ${isSelected ? 'text-red-700 font-black' : 'text-slate-900'}`}>
                                {cat.name}
                              </p>
                              <p className="text-[11px] text-slate-500 truncate">
                                {cat.tamilName}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {count !== undefined && (
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                                  isSelected
                                    ? 'bg-red-700 text-white'
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {count}
                              </span>
                            )}
                            {isSelected && (
                              <Check className="w-4 h-4 text-red-700 shrink-0 stroke-[2.5]" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Active Filter Summary, Sort Selector & View Mode Switcher */}
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-1.5 sm:gap-3 text-xs">
            <div className="flex items-center gap-1.5 min-w-0 shrink">
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 font-bold px-1.5 py-0.5 rounded-md border border-red-100 text-[10px] sm:text-[11px] truncate max-w-[120px] sm:max-w-none">
                  <span className="truncate">{CATEGORIES.find((c) => c.id === selectedCategory)?.name}</span>
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="hover:text-red-950 ml-0.5 shrink-0"
                    title="Remove filter"
                  >
                    <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 font-bold px-1.5 py-0.5 rounded-md border border-amber-200 text-[10px] sm:text-[11px] truncate max-w-[120px] sm:max-w-none">
                  <span className="truncate">"{searchQuery}"</span>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="hover:text-amber-950 ml-0.5 shrink-0"
                    title="Clear search"
                  >
                    <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  </button>
                </span>
              )}
              {(selectedCategory !== 'all' || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}
                  className="text-red-700 hover:text-red-900 font-bold underline text-[10px] sm:text-xs ml-0.5 cursor-pointer whitespace-nowrap"
                >
                  Reset
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2.5 ml-auto shrink-0">
              {/* Sort Selector */}
              <div className="flex items-center gap-1">
                <SlidersHorizontal className="hidden sm:inline w-3.5 h-3.5 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-50 hover:bg-white text-slate-700 text-[11px] sm:text-xs rounded-lg sm:rounded-xl px-1.5 sm:px-2.5 py-1.5 border border-slate-200 focus:outline-none focus:border-red-700 font-bold shadow-2xs cursor-pointer"
                  id="catalog-sort-select"
                >
                  <option value="featured">⭐ Featured</option>
                  <option value="price-asc">₹ Low → High</option>
                  <option value="price-desc">₹ High → Low</option>
                  <option value="discount">% Discount</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-slate-100 rounded-lg sm:rounded-xl p-0.5 border border-slate-200 shrink-0">
                <button
                  onClick={() => setViewMode('table')}
                  className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold transition-colors uppercase tracking-wider ${
                    viewMode === 'table'
                      ? 'bg-red-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Wholesale Table View"
                  id="view-mode-table-btn"
                >
                  <Table className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Table</span>
                </button>

                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold transition-colors uppercase tracking-wider ${
                    viewMode === 'grid'
                      ? 'bg-red-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Card Grid View"
                  id="view-mode-grid-btn"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Grid</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Display Area */}
        <div className="mt-6">
          {filteredProducts.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
              <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-800">No products found matching your search</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Try searching for another term like "sparklers", "pots", "shots", "bomb", or select "All Products".
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="mt-4 bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl uppercase tracking-wider"
              >
                Reset Catalog
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="space-y-8" id="catalog-category-grouped-grid">
              {groupedProducts.map((group) => (
                <section key={group.category.id} className="space-y-4" id={`category-grid-section-${group.category.id}`}>
                  {/* Category Header with Name, Tamil Name and Item Count */}
                  <div className="flex items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs">
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-xl bg-red-700 text-amber-300 flex items-center justify-center font-black shadow-xs shrink-0">
                        <Sparkles className="w-5 h-5" />
                      </span>
                      <div>
                        <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-slate-900 leading-tight">
                          {group.category.name}
                        </h2>
                        <p className="text-xs sm:text-sm font-semibold text-red-700">
                          {group.category.tamilName}
                        </p>
                      </div>
                    </div>
                    <span className="bg-red-50 text-red-700 border border-red-200 text-xs font-black px-3 py-1 rounded-full shrink-0">
                      {group.items.length} Items
                    </span>
                  </div>

                  {/* Products Grid for this Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {group.items.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        quantityInCart={cartQuantities[product.id] || 0}
                        onUpdateQuantity={handleUpdateQuantity}
                        onAddToCart={handleAddToCart}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <ProductTable
              products={filteredProducts}
              cartQuantities={cartQuantities}
              onUpdateQuantity={handleUpdateQuantity}
              categories={CATEGORIES}
              groupByCategory={true}
            />
          )}
        </div>
      </main>

      {/* Showroom Physical Store Location & Info Section */}
      <StoreLocation />

      {/* Safe Celebration & Green Fireworks Guidelines */}
      <SafetyGuidelines />

      {/* Comprehensive Footer */}
      <Footer
        onSelectCategory={(id) => {
          setSelectedCategory(id);
          handleQuickOrderScroll();
        }}
        onOpenEstimate={() => setEstimateModalOpen(true)}
        categories={CATEGORIES}
      />

      {/* Cart Side-Drawer */}
      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={handleClearCart}
        onOpenEstimate={() => {
          setCartDrawerOpen(false);
          setEstimateModalOpen(true);
        }}
        milestones={OFFER_MILESTONES}
        customerInfo={customerInfo}
        onCustomerInfoChange={setCustomerInfo}
      />

      {/* Printable Estimate Quotation Modal */}
      <EstimateModal
        isOpen={estimateModalOpen}
        onClose={() => setEstimateModalOpen(false)}
        cartItems={cartItems}
        customerInfo={customerInfo}
        milestones={OFFER_MILESTONES}
      />

      {/* Complete Wholesale Price List Modal (PDF & CSV Download) */}
      <PriceListModal
        isOpen={priceListModalOpen}
        onClose={() => setPriceListModalOpen(false)}
        products={PRODUCTS}
        categories={CATEGORIES}
      />

      {/* Mobile Sticky Floating Cart Bottom Bar */}
      {totalItems > 0 && (
        <div
          className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-6 sm:w-auto z-40 animate-slideUp"
          id="sticky-mobile-cart-bar"
        >
          <div className="bg-slate-900 border border-slate-700 p-3 sm:px-5 rounded-2xl shadow-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative p-2 rounded-xl bg-red-700 text-white font-black">
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute -top-2 -right-2 bg-amber-400 text-slate-950 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-900 animate-bounce">
                  {totalItems}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block leading-none">
                  Cart Total ({totalItems} items)
                </span>
                <span className="text-base sm:text-lg font-black text-white">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-green-400 font-bold block sm:inline sm:ml-2">
                  (Saved ₹{totalSavings.toLocaleString('en-IN')})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setEstimateModalOpen(true)}
                className="hidden sm:flex bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-xl text-xs font-bold border border-slate-700 items-center gap-1 uppercase tracking-wider"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Estimate</span>
              </button>

              <button
                onClick={() => setCartDrawerOpen(true)}
                className="bg-red-700 hover:bg-red-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-1.5 shadow-md active:scale-95 transition-transform uppercase tracking-wider"
                id="floating-view-cart-btn"
              >
                <span>View Cart</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
