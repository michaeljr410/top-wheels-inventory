import { useState, useMemo } from 'react';
import { vehicles } from '@/data/vehicles';
import type { Vehicle, VehicleCategory } from '@/data/types';
import { CATEGORY_LABELS, CATEGORY_ICONS } from '@/data/types';
import { VehicleCard } from './VehicleCard';
import { ScrollReveal } from './ScrollReveal';

/** Deterministic shuffle with VW Atlas first, BMW 530i second */
function shuffleInventory(items: Vehicle[]): Vehicle[] {
  // Pull pinned vehicles out
  const atlas = items.find(v => v.id === 'vehicle-7');    // VW Atlas
  const bmw530 = items.find(v => v.id === 'vehicle-5');   // BMW 530i
  const rest = items.filter(v => v.id !== 'vehicle-7' && v.id !== 'vehicle-5');

  // Seeded shuffle (changes daily so it feels fresh but stays consistent per session)
  const seed = new Date().toISOString().slice(0, 10);
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  const shuffled = [...rest];
  for (let i = shuffled.length - 1; i > 0; i--) {
    hash = ((hash << 5) - hash + i) | 0;
    const j = Math.abs(hash) % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Pin at top
  const result: Vehicle[] = [];
  if (atlas) result.push(atlas);
  if (bmw530) result.push(bmw530);
  result.push(...shuffled);
  return result;
}

interface InventoryProps {
  onGetStarted: (vehicle: Vehicle) => void;
}

const CATEGORIES: Array<{ key: VehicleCategory | 'all'; label: string; icon: string }> = [
  { key: 'all', label: 'All', icon: '🔥' },
  { key: 'vehicles', label: CATEGORY_LABELS.vehicles, icon: CATEGORY_ICONS.vehicles },
  { key: 'boats', label: CATEGORY_LABELS.boats, icon: CATEGORY_ICONS.boats },
  { key: 'rvs', label: CATEGORY_LABELS.rvs, icon: CATEGORY_ICONS.rvs },
  { key: 'equipment', label: CATEGORY_LABELS.equipment, icon: CATEGORY_ICONS.equipment },
];

export const Inventory = ({ onGetStarted }: InventoryProps) => {
  const [activeCategory, setActiveCategory] = useState<VehicleCategory | 'all'>('all');

  const availableVehicles = vehicles.filter(v => v.isAvailable);
  const shuffledAll = useMemo(() => shuffleInventory(availableVehicles), [availableVehicles]);
  const filteredVehicles = activeCategory === 'all'
    ? shuffledAll
    : availableVehicles.filter(v => v.category === activeCategory);

  // Count per category
  const counts: Record<string, number> = {
    all: availableVehicles.length,
    boats: availableVehicles.filter(v => v.category === 'boats').length,
    vehicles: availableVehicles.filter(v => v.category === 'vehicles').length,
    rvs: availableVehicles.filter(v => v.category === 'rvs').length,
    equipment: availableVehicles.filter(v => v.category === 'equipment').length,
  };

  return (
    <section id="inventory" className="py-20 md:py-28">
      <div className="container mx-auto px-6 max-w-[1100px]">
        {/* Section header */}
        <ScrollReveal>
          <div className="mb-10">
            <div className="flex items-center gap-3 text-[0.68rem] tracking-[0.25em] uppercase text-cyan mb-4">
              <span className="w-8 h-px bg-cyan" />
              Available Now
            </div>
            <h2 className="font-heading text-[clamp(2.4rem,5vw,3.8rem)] leading-none mb-5">
              CURRENT INVENTORY
            </h2>
            <p className="text-[1.05rem] text-tw-dim max-w-[600px] leading-relaxed">
              Boats, trucks, cars, RVs — all available for creative finance acquisition.
              Entry fees start low. Monthly payments you can actually handle.
              No bank approval needed.
            </p>
          </div>
        </ScrollReveal>

        {/* Category tabs */}
        <ScrollReveal delay={0.1}>
          <div className="flex flex-wrap gap-2 mb-10">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all border ${
                  activeCategory === cat.key
                    ? 'bg-cyan/10 border-cyan/40 text-cyan'
                    : 'bg-dark-elevated/40 border-dark-border text-tw-dim hover:text-tw-text hover:border-tw-muted/30'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <span className={`ml-1 text-xs font-mono ${
                  activeCategory === cat.key ? 'text-cyan/80' : 'text-tw-muted'
                }`}>
                  {counts[cat.key]}
                </span>
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Vehicle grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredVehicles.map((vehicle, index) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              index={index}
              onGetStarted={onGetStarted}
            />
          ))}
        </div>

        {/* Empty state */}
        {filteredVehicles.length === 0 && (
          <div className="text-center py-20">
            <p className="text-tw-dim text-lg">
              No {activeCategory !== 'all' ? CATEGORY_LABELS[activeCategory].toLowerCase() : 'vehicles'} available right now. Check back soon.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
