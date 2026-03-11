export type DealType =
  | 'subject-to'
  | 'seller-finance'
  | 'lease-option'
  | 'wrap'
  | 'cash-deal';

export type VehicleCategory = 'boats' | 'vehicles' | 'rvs' | 'equipment';

export interface Vehicle {
  id: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
  color?: string;
  mileage?: number;
  hours?: number; // For boats
  vin?: string;
  category: VehicleCategory;

  // Deal terms
  entryFee: number;
  monthlyPayment: number;
  monthsLeft: number;
  interestRate: number;
  loanBalance?: number;
  purchasePrice?: number;
  dealType: DealType;
  gap?: boolean;
  balloonPayment?: number;
  paymentNote?: string; // e.g. "→ $1,035 @ month 58"
  sellerContribution?: string; // e.g. "$115/mo cost-share"

  // Location
  city: string;
  state: string;

  // Media
  photos: string[];
  dropboxUrl?: string; // Link to full Dropbox photo gallery

  // Details
  highlights?: string[];
  description?: string;

  // Status
  isAvailable: boolean;
  isFeatured?: boolean;
}

export const DEAL_TYPE_LABELS: Record<DealType, string> = {
  'subject-to': 'Subject-To',
  'seller-finance': 'Seller Finance',
  'lease-option': 'Lease Option',
  'wrap': 'Wrap',
  'cash-deal': 'Cash Deal',
};

export const DEAL_TYPE_COLORS: Record<DealType, string> = {
  'subject-to': 'bg-cyan/20 text-cyan-light border-cyan/30',
  'seller-finance': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'lease-option': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  'wrap': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'cash-deal': 'bg-tw-white/10 text-tw-white border-tw-white/20',
};

export const CATEGORY_LABELS: Record<VehicleCategory, string> = {
  boats: 'Boats',
  vehicles: 'Trucks & Cars',
  rvs: 'RVs & Trailers',
  equipment: 'Heavy Equipment',
};

export const CATEGORY_ICONS: Record<VehicleCategory, string> = {
  boats: '⚓',
  vehicles: '🚗',
  rvs: '🚐',
  equipment: '🚜',
};
