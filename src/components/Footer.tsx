import { ScrollReveal } from './ScrollReveal';

export const Footer = () => (
  <footer className="border-t border-dark-border py-16">
    <div className="container mx-auto px-6 max-w-[1000px]">
      <ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="font-heading text-[1.6rem] tracking-[0.08em] mb-3">
              <span className="text-cyan">TOP</span>
              <span className="text-tw-text">WHEELS</span>
            </div>
            <p className="text-sm text-tw-dim leading-relaxed mb-4">
              Creative Vehicle Deals. Done Right.
              Built on the proprietary T.O.P. Method.
            </p>
            <p className="text-sm text-tw-muted italic">
              "Own more, bank less."
            </p>
          </div>

          {/* Links */}
          <div>
            <div className="text-[0.68rem] text-tw-muted uppercase tracking-[0.2em] mb-4">Links</div>
            <div className="space-y-2.5">
              <a href="https://sellfi.io" target="_blank" rel="noopener noreferrer" className="block text-sm text-tw-dim hover:text-cyan transition-colors">
                SellFi.io &rarr;
              </a>
              <a href="https://topwheels.io" target="_blank" rel="noopener noreferrer" className="block text-sm text-tw-dim hover:text-cyan transition-colors">
                TopWheels.io &rarr;
              </a>
              <a href="#inventory" className="block text-sm text-tw-dim hover:text-cyan transition-colors">
                Browse Inventory
              </a>
            </div>
          </div>

          {/* Legal */}
          <div>
            <div className="text-[0.68rem] text-tw-muted uppercase tracking-[0.2em] mb-4">Legal</div>
            <p className="text-xs text-tw-muted leading-relaxed">
              TOP Wheels is a DBA of Vivant Investments LLC. All creative finance transactions
              are facilitated through proper legal channels with full documentation.
              Vehicles listed are subject to availability and buyer vetting.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-dark-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-tw-muted">
            &copy; {new Date().getFullYear()} Vivant Investments LLC (DBA TOP Wheels). All rights reserved.
          </p>
          <p className="text-xs text-tw-muted">
            Created by Mike Davis &mdash; Founder of{' '}
            <a href="https://sellfi.io" target="_blank" rel="noopener noreferrer" className="text-cyan hover:text-cyan-light transition-colors">SellFi</a>
            {' '}&amp; Creator of the T.O.P. Method
          </p>
        </div>
      </ScrollReveal>
    </div>
  </footer>
);
