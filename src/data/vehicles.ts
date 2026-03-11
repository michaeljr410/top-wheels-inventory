import type { Vehicle } from './types';

/**
 * TOP Wheels Vehicle Inventory
 *
 * Mike: Replace these placeholder vehicles with your real inventory.
 * Each vehicle needs: year, make, model, entry fee, monthly payment,
 * months left, interest rate, location, deal type, and photos.
 *
 * Photos: Drop images in /public/images/vehicles/ and reference them
 * as "/images/vehicles/filename.jpg" — or use external URLs (Dropbox, etc.)
 */
export const vehicles: Vehicle[] = [
  {
    id: 'vehicle-1',
    year: 2021,
    make: 'Volkswagen',
    model: 'Atlas',
    trim: 'SE w/Technology',
    color: 'Pure White',
    mileage: 42000,
    entryFee: 2500,
    monthlyPayment: 485,
    monthsLeft: 48,
    interestRate: 4.9,
    loanBalance: 19800,
    dealType: 'subject-to',
    city: 'Atlanta',
    state: 'GA',
    photos: [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=500&fit=crop',
    ],
    highlights: [
      'Third row seating — seats 7',
      'Apple CarPlay / Android Auto',
      'Panoramic sunroof',
      'Backup camera + blind spot monitoring',
    ],
    description: 'Family-friendly SUV with all the tech. Low entry, manageable payments.',
    isAvailable: true,
    isFeatured: true,
  },
  {
    id: 'vehicle-2',
    year: 2020,
    make: 'BMW',
    model: '330i',
    trim: 'xDrive',
    color: 'Mineral Grey Metallic',
    mileage: 38000,
    entryFee: 3500,
    monthlyPayment: 520,
    monthsLeft: 42,
    interestRate: 5.2,
    loanBalance: 18500,
    dealType: 'seller-finance',
    city: 'Charlotte',
    state: 'NC',
    photos: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=500&fit=crop',
    ],
    highlights: [
      'All-wheel drive',
      'Sport package with M Sport brakes',
      'Premium Harman Kardon sound',
      'Heated steering wheel + seats',
    ],
    description: 'Luxury sedan, AWD. Seller financing available — no bank needed.',
    isAvailable: true,
    isFeatured: true,
  },
  {
    id: 'vehicle-3',
    year: 2019,
    make: 'Chevrolet',
    model: 'Silverado 1500',
    trim: 'Z71 LT Trail Boss',
    color: 'Summit White',
    mileage: 55000,
    entryFee: 2000,
    monthlyPayment: 450,
    monthsLeft: 36,
    interestRate: 4.5,
    loanBalance: 14200,
    dealType: 'subject-to',
    city: 'Dallas',
    state: 'TX',
    photos: [
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=500&fit=crop',
    ],
    highlights: [
      'Z71 off-road package',
      '5.3L V8 engine',
      'Crew cab — seats 5',
      'Tow package (9,400 lb capacity)',
    ],
    description: 'Trail Boss with the Z71 package. Work truck meets weekend warrior.',
    isAvailable: true,
  },
  // ==========================================
  // ADD YOUR REAL VEHICLES BELOW
  // Copy the template above and fill in your data.
  // ==========================================
];

// Computed stats for the hero section
export function getInventoryStats() {
  const available = vehicles.filter(v => v.isAvailable);
  const avgMonthly = available.length > 0
    ? Math.round(available.reduce((sum, v) => sum + v.monthlyPayment, 0) / available.length)
    : 0;
  const lowestEntry = available.length > 0
    ? Math.min(...available.map(v => v.entryFee))
    : 0;

  return {
    totalAvailable: available.length,
    avgMonthlyPayment: avgMonthly,
    lowestEntryFee: lowestEntry,
  };
}
