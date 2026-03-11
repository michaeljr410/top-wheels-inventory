import { motion } from 'framer-motion';
import { getInventoryStats } from '@/data/vehicles';
import { formatCurrency } from '@/lib/utils';

export const Hero = () => {
  const stats = getInventoryStats();

  return (
    <section className="relative min-h-screen flex items-center pt-[120px] pb-20 overflow-hidden">
      {/* Background glows */}
      <div className="absolute -top-[250px] -right-[250px] w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(14,165,233,0.08)_0%,rgba(6,182,212,0.03)_40%,transparent_70%)] pointer-events-none animate-float" />
      <div className="absolute -bottom-[200px] -left-[250px] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(6,182,212,0.06)_0%,transparent_70%)] pointer-events-none animate-float-reverse" />

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-[200px] bg-gradient-to-t from-dark to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 max-w-[900px]">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 border border-cyan/30 bg-cyan/5 px-4 py-2 text-[0.72rem] tracking-[0.15em] uppercase text-cyan mb-8"
        >
          <span className="w-1.5 h-1.5 bg-cyan rounded-full animate-pulse-dot shadow-[0_0_8px_#0EA5E9]" />
          Creative Finance Inventory
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-heading text-[clamp(3.2rem,8vw,7.5rem)] leading-[0.92] tracking-tight mb-7"
        >
          OWN MORE,
          <span className="text-cyan block relative">
            BANK LESS.
            <span className="absolute bottom-1 left-0 h-1 bg-gradient-to-r from-cyan to-teal animate-draw-line" />
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-[clamp(1.05rem,2vw,1.2rem)] text-tw-dim max-w-[640px] mb-6 leading-relaxed"
        >
          Boats, trucks, RVs, luxury vehicles — all available through creative finance.
          No banks. No credit checks. Just deals that work.
        </motion.p>

        {/* SellFi disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="inline-flex items-center gap-3 bg-dark-elevated/60 border border-dark-border px-5 py-3 mb-10 max-w-[640px]"
        >
          <span className="text-cyan text-lg shrink-0">&#9432;</span>
          <p className="text-sm text-tw-dim leading-relaxed">
            While{' '}
            <a href="https://sellfi.io" target="_blank" rel="noopener noreferrer" className="text-cyan hover:text-cyan-light transition-colors font-medium">
              SellFi.io
            </a>{' '}
            undergoes final production, browse Mike's current creative finance inventory below.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex gap-8 sm:gap-12 flex-wrap"
        >
          <StatBlock value={`${stats.totalAvailable}`} label="Total Available" />
          <StatBlock value={`${stats.boatCount}`} label="Boats" />
          <StatBlock value={`${stats.vehicleCount}`} label="Trucks & Cars" />
          <StatBlock value={`${stats.rvCount}`} label="RVs & Trailers" />
          <StatBlock value={`${formatCurrency(stats.lowestEntryFee)}`} label="Lowest Entry" />
        </motion.div>
      </div>
    </section>
  );
};

const StatBlock = ({ value, label }: { value: string; label: string }) => (
  <div>
    <div className="font-heading text-[2rem] sm:text-[2.6rem] text-cyan leading-none">{value}</div>
    <div className="text-[0.68rem] sm:text-[0.72rem] text-tw-muted uppercase tracking-[0.1em] mt-1">{label}</div>
  </div>
);
