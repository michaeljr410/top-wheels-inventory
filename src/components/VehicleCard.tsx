import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Percent, ChevronDown, Banknote, Gauge, Palette, Clock, ExternalLink, Shield, AlertTriangle } from 'lucide-react';
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
    <ScrollReveal delay={Math.min(index * 0.08, 0.4)}>
      <motion.div
        className="bg-dark-card border border-dark-border overflow-hidden hover:border-cyan/20 transition-all duration-500 group flex flex-col"
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Photo section */}
        <VehiclePhotoCarousel photos={vehicle.photos} alt={title} />

        {/* Content */}
        <div className="p-5 sm:p-6 flex flex-col flex-1">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="min-w-0">
              <h3 className="font-heading text-[1.4rem] sm:text-[1.6rem] leading-tight tracking-wide">
                {title}
              </h3>
              {subtitle && (
                <p className="text-tw-dim text-sm mt-0.5 truncate">{subtitle}</p>
              )}
            </div>
            <span className={`inline-flex items-center px-2.5 py-1 text-[0.65rem] font-semibold tracking-wide border shrink-0 ${DEAL_TYPE_COLORS[vehicle.dealType]} whitespace-nowrap`}>
              {DEAL_TYPE_LABELS[vehicle.dealType]}
            </span>
          </div>

          {/* Price row */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-dark-elevated/60 border border-dark-border p-3 sm:p-4">
              <div className="text-[0.65rem] text-tw-muted uppercase tracking-[0.15em] mb-1">Entry Fee</div>
              <div className="font-mono text-xl sm:text-2xl text-cyan font-semibold">{formatCurrency(vehicle.entryFee)}</div>
            </div>
            <div className="bg-dark-elevated/60 border border-dark-border p-3 sm:p-4">
              <div className="text-[0.65rem] text-tw-muted uppercase tracking-[0.15em] mb-1">Monthly</div>
              <div className="font-mono text-xl sm:text-2xl text-cyan font-semibold">{formatCurrency(vehicle.monthlyPayment)}<span className="text-xs text-tw-dim">/mo</span></div>
              {vehicle.paymentNote && (
                <div className="text-[0.65rem] text-emerald-400 mt-1">{vehicle.paymentNote}</div>
              )}
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-x-5 gap-y-2 mb-5 text-sm">
            <div className="flex items-center gap-2 text-tw-dim">
              <Calendar size={14} className="text-cyan/70 shrink-0" />
              <span>{vehicle.monthsLeft} months left</span>
            </div>
            <div className="flex items-center gap-2 text-tw-dim">
              <Percent size={14} className="text-cyan/70 shrink-0" />
              <span>{vehicle.interestRate}% rate</span>
            </div>
            <div className="flex items-center gap-2 text-tw-dim">
              <MapPin size={14} className="text-cyan/70 shrink-0" />
              <span>{vehicle.city}, {vehicle.state}</span>
            </div>
          </div>

          {/* Special deal badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {vehicle.interestRate === 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[0.65rem] bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                0% Interest
              </span>
            )}
            {vehicle.gap && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[0.65rem] bg-cyan/10 text-cyan border border-cyan/25">
                <Shield size={10} /> GAP Included
              </span>
            )}
            {vehicle.balloonPayment && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[0.65rem] bg-amber-500/15 text-amber-400 border border-amber-500/25">
                <AlertTriangle size={10} /> {formatCurrency(vehicle.balloonPayment)} balloon
              </span>
            )}
            {vehicle.sellerContribution && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[0.65rem] bg-purple-500/15 text-purple-400 border border-purple-500/25">
                Seller Cost-Share
              </span>
            )}
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
                {vehicle.loanBalance != null && (
                  <DetailStat icon={<Banknote size={14} />} label="Loan Balance" value={formatCurrency(vehicle.loanBalance)} />
                )}
                {vehicle.mileage != null && (
                  <DetailStat icon={<Gauge size={14} />} label="Mileage" value={`${formatNumber(vehicle.mileage)} mi`} />
                )}
                {vehicle.hours != null && (
                  <DetailStat icon={<Clock size={14} />} label="Hours" value={`${formatNumber(vehicle.hours)} hrs`} />
                )}
                {vehicle.color && (
                  <DetailStat icon={<Palette size={14} />} label="Color" value={vehicle.color} />
                )}
                {vehicle.purchasePrice != null && (
                  <DetailStat icon={<Banknote size={14} />} label="Purchase Price" value={formatCurrency(vehicle.purchasePrice)} />
                )}
              </div>

              {/* Seller contribution callout */}
              {vehicle.sellerContribution && (
                <div className="p-3 bg-purple-500/10 border border-purple-500/20 text-sm text-purple-300">
                  <span className="font-semibold">Seller Contribution:</span> {vehicle.sellerContribution}
                </div>
              )}

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
                      <li key={i} className="flex items-start gap-2 text-sm text-tw-dim">
                        <span className="text-cyan font-bold mt-0.5 shrink-0">&rarr;</span>
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

              {/* Dropbox photo gallery link */}
              {vehicle.dropboxUrl && (
                <a
                  href={vehicle.dropboxUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-cyan hover:text-cyan-light transition-colors"
                >
                  <ExternalLink size={14} />
                  View All Photos
                </a>
              )}
            </div>
          </motion.div>

          {/* CTA — pushed to bottom */}
          <div className="mt-auto pt-2">
            <button
              onClick={() => onGetStarted(vehicle)}
              className="w-full bg-cyan text-dark font-bold text-sm tracking-[0.06em] uppercase py-3.5 hover:bg-cyan-light hover:-translate-y-0.5 transition-all relative overflow-hidden group/btn"
            >
              <span className="relative z-10">Get Started</span>
              <span className="absolute inset-0 bg-white/20 scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-500 origin-left" />
            </button>
          </div>
        </div>
      </motion.div>
    </ScrollReveal>
  );
};

const DetailStat = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="bg-dark/60 border border-dark-border p-3">
    <div className="flex items-center gap-1.5 text-tw-muted text-[0.65rem] uppercase tracking-wider mb-1">
      <span className="text-cyan/60">{icon}</span>
      {label}
    </div>
    <div className="text-sm text-tw-text font-medium">{value}</div>
  </div>
);
