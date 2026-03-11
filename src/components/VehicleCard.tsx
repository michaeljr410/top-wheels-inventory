import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Percent, ChevronDown, Banknote, Gauge, Palette } from 'lucide-react';
import { VehiclePhotoCarousel } from './VehiclePhotoCarousel';
import { ScrollReveal } from './ScrollReveal';
import type { Vehicle } from '@/data/types';
import { DEAL_TYPE_LABELS, DEAL_TYPE_COLORS } from '@/data/types';
import { formatCurrency, formatNumber } from '@/lib/utils';

interface VehicleCardProps {
  vehicle: Vehicle;
  index: number;
  onGetStarted: (vehicle: Vehicle) => void;
}

export const VehicleCard = ({ vehicle, index, onGetStarted }: VehicleCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const title = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
  const subtitle = vehicle.trim ? vehicle.trim : '';

  return (
    <ScrollReveal delay={index * 0.1}>
      <motion.div
        className="bg-dark-card border border-dark-border overflow-hidden hover:border-cyan/20 transition-all duration-500 group"
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Photo section */}
        <VehiclePhotoCarousel photos={vehicle.photos} alt={title} />

        {/* Content */}
        <div className="p-6">
          {/* Header row */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h3 className="font-heading text-[1.6rem] leading-tight tracking-wide">
                {title}
              </h3>
              {subtitle && (
                <p className="text-tw-dim text-sm mt-0.5">{subtitle}</p>
              )}
            </div>
            <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold tracking-wide border ${DEAL_TYPE_COLORS[vehicle.dealType]} whitespace-nowrap`}>
              {DEAL_TYPE_LABELS[vehicle.dealType]}
            </span>
          </div>

          {/* Price row */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-dark-elevated/60 border border-dark-border p-4">
              <div className="text-[0.68rem] text-tw-muted uppercase tracking-[0.15em] mb-1">Entry Fee</div>
              <div className="font-mono text-2xl text-cyan font-semibold">{formatCurrency(vehicle.entryFee)}</div>
            </div>
            <div className="bg-dark-elevated/60 border border-dark-border p-4">
              <div className="text-[0.68rem] text-tw-muted uppercase tracking-[0.15em] mb-1">Monthly Payment</div>
              <div className="font-mono text-2xl text-cyan font-semibold">{formatCurrency(vehicle.monthlyPayment)}<span className="text-sm text-tw-dim">/mo</span></div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 mb-6 text-sm">
            <div className="flex items-center gap-2 text-tw-dim">
              <Calendar size={14} className="text-cyan/70" />
              <span>{vehicle.monthsLeft} months left</span>
            </div>
            <div className="flex items-center gap-2 text-tw-dim">
              <Percent size={14} className="text-cyan/70" />
              <span>{vehicle.interestRate}% rate</span>
            </div>
            <div className="flex items-center gap-2 text-tw-dim">
              <MapPin size={14} className="text-cyan/70" />
              <span>{vehicle.city}, {vehicle.state}</span>
            </div>
          </div>

          {/* Expandable details */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-sm text-tw-muted hover:text-cyan transition-colors mb-4"
          >
            <ChevronDown
              size={16}
              className={`transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
            />
            {expanded ? 'Less details' : 'More details'}
          </button>

          <motion.div
            initial={false}
            animate={{
              height: expanded ? 'auto' : 0,
              opacity: expanded ? 1 : 0,
            }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-4 space-y-4">
              {/* Detail stats */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {vehicle.loanBalance && (
                  <DetailStat icon={<Banknote size={14} />} label="Loan Balance" value={formatCurrency(vehicle.loanBalance)} />
                )}
                {vehicle.mileage && (
                  <DetailStat icon={<Gauge size={14} />} label="Mileage" value={`${formatNumber(vehicle.mileage)} mi`} />
                )}
                {vehicle.color && (
                  <DetailStat icon={<Palette size={14} />} label="Color" value={vehicle.color} />
                )}
              </div>

              {/* VIN */}
              {vehicle.vin && (
                <div className="text-xs text-tw-muted">
                  <span className="text-tw-dim">VIN:</span> <span className="font-mono">{vehicle.vin}</span>
                </div>
              )}

              {/* Highlights */}
              {vehicle.highlights && vehicle.highlights.length > 0 && (
                <div>
                  <div className="text-xs text-tw-muted uppercase tracking-[0.15em] mb-2">Highlights</div>
                  <ul className="space-y-1.5">
                    {vehicle.highlights.map((h, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-tw-dim">
                        <span className="text-cyan font-bold">&rarr;</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Description */}
              {vehicle.description && (
                <p className="text-sm text-tw-dim leading-relaxed border-l-2 border-cyan/30 pl-4 italic">
                  {vehicle.description}
                </p>
              )}
            </div>
          </motion.div>

          {/* CTA */}
          <button
            onClick={() => onGetStarted(vehicle)}
            className="w-full bg-cyan text-dark font-bold text-sm tracking-[0.06em] uppercase py-3.5 hover:bg-cyan-light hover:-translate-y-0.5 transition-all relative overflow-hidden group/btn"
          >
            <span className="relative z-10">Get Started</span>
            <span className="absolute inset-0 bg-white/20 scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-500 origin-left" />
          </button>
        </div>
      </motion.div>
    </ScrollReveal>
  );
};

const DetailStat = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="bg-dark/60 border border-dark-border p-3">
    <div className="flex items-center gap-1.5 text-tw-muted text-[0.68rem] uppercase tracking-wider mb-1">
      <span className="text-cyan/60">{icon}</span>
      {label}
    </div>
    <div className="text-sm text-tw-text font-medium">{value}</div>
  </div>
);
