import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToInventory = () => {
    document.getElementById('inventory')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-[1000] flex items-center justify-between px-6 transition-all duration-400 ${
        scrolled
          ? 'py-3 glass border-b border-cyan/15'
          : 'py-4 glass border-b border-cyan/8'
      }`}
    >
      {/* Logo */}
      <a href="#" className="font-heading text-[1.6rem] tracking-[0.08em] flex items-baseline gap-[2px]">
        <span className="text-cyan">TOP</span>
        <span className="text-tw-text text-[0.85em]">WHEELS</span>
      </a>

      {/* Nav links (hidden on mobile) */}
      <div className="hidden md:flex items-center gap-2">
        <a href="#inventory" className="text-tw-dim text-sm font-medium px-4 py-2 hover:text-cyan transition-colors">
          Inventory
        </a>
        <a href="https://sellfi.io" target="_blank" rel="noopener noreferrer" className="text-tw-dim text-sm font-medium px-4 py-2 hover:text-cyan transition-colors">
          SellFi.io
        </a>
        <button
          onClick={scrollToInventory}
          className="bg-cyan text-dark font-bold text-xs tracking-[0.06em] uppercase px-6 py-2.5 hover:bg-cyan-light hover:-translate-y-0.5 transition-all relative overflow-hidden group"
        >
          <span className="relative z-10">Browse Inventory</span>
          <span className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-150 rounded-full transition-transform duration-500 origin-center" />
        </button>
      </div>

      {/* Mobile CTA */}
      <button
        onClick={scrollToInventory}
        className="md:hidden bg-cyan text-dark font-bold text-xs tracking-[0.06em] uppercase px-4 py-2 hover:bg-cyan-light transition-all"
      >
        Browse
      </button>
    </motion.nav>
  );
};
