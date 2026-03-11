import { vehicles } from '@/data/vehicles';
import type { Vehicle } from '@/data/types';
import { VehicleCard } from './VehicleCard';
import { ScrollReveal } from './ScrollReveal';

interface InventoryProps {
  onGetStarted: (vehicle: Vehicle) => void;
}

export const Inventory = ({ onGetStarted }: InventoryProps) => {
  const availableVehicles = vehicles.filter(v => v.isAvailable);

  return (
    <section id="inventory" className="py-20 md:py-28">
      <div className="container mx-auto px-6 max-w-[1000px]">
        {/* Section header */}
        <ScrollReveal>
          <div className="mb-16">
            <div className="flex items-center gap-3 text-[0.68rem] tracking-[0.25em] uppercase text-cyan mb-4">
              <span className="w-8 h-px bg-cyan" />
              Available Now
            </div>
            <h2 className="font-heading text-[clamp(2.4rem,5vw,3.8rem)] leading-none mb-5">
              CURRENT INVENTORY
            </h2>
            <p className="text-[1.05rem] text-tw-dim max-w-[600px] leading-relaxed">
              Every vehicle listed here is available for creative finance acquisition.
              Entry fees start low. Monthly payments you can actually handle.
              No bank approval needed.
            </p>
          </div>
        </ScrollReveal>

        {/* Vehicle grid — vertical cascade */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {availableVehicles.map((vehicle, index) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              index={index}
              onGetStarted={onGetStarted}
            />
          ))}
        </div>

        {/* Empty state */}
        {availableVehicles.length === 0 && (
          <div className="text-center py-20">
            <p className="text-tw-dim text-lg">
              All vehicles have been claimed. Check back soon for new inventory.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
