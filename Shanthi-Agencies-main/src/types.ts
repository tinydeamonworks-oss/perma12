export interface Product {
  id: string;
  name: string;
  tamilName: string;
  category: string;
  unit: string; // e.g. "1 Box (10 Pcs)", "1 Packet", "1 Pcs"
  mrp: number; // Original Maximum Retail Price (₹)
  price: number; // Discounted Offer Price (₹)
  discountPercent: number;
  image: string;
  badge?: string;
  description: string;
  soundLevel?: 'Low' | 'Medium' | 'High' | 'Musical' | 'Visual No-Sound';
  inStock: boolean;
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  tamilName: string;
  iconName: string;
  count?: number;
}

export interface OfferMilestone {
  minAmount: number;
  rewardTitle: string;
  rewardDescription: string;
  icon: string;
}

export interface CustomerOrderInfo {
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  state?: string;
  district: string;
  pincode: string;
  notes?: string;
  place?: string;
}
