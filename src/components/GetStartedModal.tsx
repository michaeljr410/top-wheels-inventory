import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Calendar, Send } from 'lucide-react';
import type { Vehicle } from '@/data/types';
import { DEAL_TYPE_LABELS } from '@/data/types';
import { formatCurrency } from '@/lib/utils';

// Declare Calendly types
declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (options: {
        url: string;
        parentElement: HTMLElement;
        prefill?: {
          name?: string;
          email?: string;
          customAnswers?: Record<string, string>;
        };
      }) => void;
    };
  }
}

interface GetStartedModalProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'agreements' | 'booking' | 'contact';

const CALENDLY_URL = 'https://calendly.com/mikedavis/30min';

export const GetStartedModal = ({ vehicle, isOpen, onClose }: GetStartedModalProps) => {
  const [step, setStep] = useState<Step>('agreements');
  const [agreeCreative, setAgreeCreative] = useState(false);
  const [agreeVetting, setAgreeVetting] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const calendlyRef = useRef<HTMLDivElement>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('agreements');
      setAgreeCreative(false);
      setAgreeVetting(false);
      setName('');
      setEmail('');
      setPhone('');
      setSubmitted(false);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // Load Calendly when reaching booking step
  useEffect(() => {
    if (step !== 'booking' || !vehicle) return;

    const loadCalendly = () => {
      if (!calendlyRef.current) return;
      if (!window.Calendly) {
        // Load script if not present
        if (!document.getElementById('calendly-script')) {
          const script = document.createElement('script');
          script.id = 'calendly-script';
          script.src = 'https://assets.calendly.com/assets/external/widget.js';
          script.async = true;
          script.onload = () => initWidget();
          document.head.appendChild(script);
        } else {
          // Script exists but maybe not loaded yet
          setTimeout(loadCalendly, 500);
        }
        return;
      }
      initWidget();
    };

    const initWidget = () => {
      if (!calendlyRef.current || !window.Calendly) return;
      const vehicleTitle = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
      window.Calendly.initInlineWidget({
        url: CALENDLY_URL,
        parentElement: calendlyRef.current,
        prefill: {
          customAnswers: {
            a1: `Vehicle: ${vehicleTitle} (${formatCurrency(vehicle.entryFee)} entry / ${formatCurrency(vehicle.monthlyPayment)}/mo)`,
          },
        },
      });
    };

    // Small delay to let the DOM render
    const timer = setTimeout(loadCalendly, 200);

    // Listen for Calendly events
    const handleMessage = (e: MessageEvent) => {
      if (e.origin?.includes('calendly.com') || (typeof e.data === 'object' && e.data !== null)) {
        const data = e.data as Record<string, unknown>;
        const eventType = data.event as string;
        if (eventType === 'calendly.event_scheduled' || String(JSON.stringify(data)).includes('scheduled')) {
          // Move to contact step after booking
          setTimeout(() => setStep('contact'), 1000);
        }
      }
    };
    window.addEventListener('message', handleMessage);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('message', handleMessage);
    };
  }, [step, vehicle]);

  const handleSubmitContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicle || !name || !email) return;
    setIsSubmitting(true);

    try {
      // Send to our serverless functions
      const vehicleTitle = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
      const payload = {
        name,
        email,
        phone,
        vehicle: vehicleTitle,
        entryFee: vehicle.entryFee,
        monthlyPayment: vehicle.monthlyPayment,
        dealType: DEAL_TYPE_LABELS[vehicle.dealType],
      };

      // Fire all in parallel — don't block on any
      await Promise.allSettled([
        fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }),
        fetch('/api/send-imessage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }),
        // Send buyer a follow-up SMS from Mike's number via BlueBubbles
        phone
          ? fetch('/api/send-buyer-sms', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            })
          : Promise.resolve(),
      ]);

      setSubmitted(true);
    } catch (err) {
      console.error('Follow-up error:', err);
      // Still show success — the booking is what matters
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!vehicle) return null;

  const vehicleTitle = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
  const canProceedToBooking = agreeCreative && agreeVetting;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[9990] bg-black/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 40 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-4 md:inset-auto md:top-[5vh] md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl md:max-h-[90vh] z-[9991] bg-dark-card border border-dark-border overflow-y-auto"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-tw-muted hover:text-tw-text transition-colors z-10"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div className="p-6 border-b border-dark-border">
              <div className="text-[0.68rem] text-cyan uppercase tracking-[0.15em] mb-2">
                Get Started
              </div>
              <h2 className="font-heading text-2xl tracking-wide">{vehicleTitle}</h2>
              <div className="flex items-center gap-4 mt-2 text-sm text-tw-dim">
                <span className="font-mono text-cyan">{formatCurrency(vehicle.entryFee)} entry</span>
                <span className="text-dark-border">|</span>
                <span className="font-mono text-cyan">{formatCurrency(vehicle.monthlyPayment)}/mo</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="flex border-b border-dark-border">
              {(['agreements', 'booking', 'contact'] as Step[]).map((s, i) => (
                <div
                  key={s}
                  className={`flex-1 h-1 transition-colors duration-300 ${
                    i <= ['agreements', 'booking', 'contact'].indexOf(step)
                      ? 'bg-cyan'
                      : 'bg-dark-border'
                  }`}
                />
              ))}
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Step 1: Agreements */}
              {step === 'agreements' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-heading text-xl tracking-wide mb-2">Before We Begin</h3>
                    <p className="text-sm text-tw-dim leading-relaxed">
                      Please acknowledge the following to proceed. This ensures we're on the same page
                      about how creative finance deals work.
                    </p>
                  </div>

                  {/* Checkbox 1: Creative Finance */}
                  <label className={`flex items-start gap-4 p-4 border cursor-pointer transition-all ${
                    agreeCreative ? 'border-cyan/40 bg-cyan/5' : 'border-dark-border hover:border-tw-muted/30'
                  }`}>
                    <input
                      type="checkbox"
                      checked={agreeCreative}
                      onChange={(e) => setAgreeCreative(e.target.checked)}
                      className="mt-1 w-5 h-5 rounded border-dark-border bg-dark text-cyan focus:ring-cyan focus:ring-offset-dark"
                    />
                    <div>
                      <div className="font-semibold text-sm text-tw-text mb-1">
                        I understand this is a creative finance deal
                      </div>
                      <div className="text-xs text-tw-dim leading-relaxed">
                        This is NOT a traditional car purchase through a dealership or bank.
                        Creative finance means the existing loan stays in place (subject-to) or the seller
                        finances the deal directly. I understand and accept this approach.
                      </div>
                    </div>
                  </label>

                  {/* Checkbox 2: Vetting */}
                  <label className={`flex items-start gap-4 p-4 border cursor-pointer transition-all ${
                    agreeVetting ? 'border-cyan/40 bg-cyan/5' : 'border-dark-border hover:border-tw-muted/30'
                  }`}>
                    <input
                      type="checkbox"
                      checked={agreeVetting}
                      onChange={(e) => setAgreeVetting(e.target.checked)}
                      className="mt-1 w-5 h-5 rounded border-dark-border bg-dark text-cyan focus:ring-cyan focus:ring-offset-dark"
                    />
                    <div>
                      <div className="font-semibold text-sm text-tw-text mb-1">
                        I agree to a vetting process
                      </div>
                      <div className="text-xs text-tw-dim leading-relaxed">
                        TOP Wheels vets all buyers to protect both parties. This includes a brief
                        phone/video call and identity verification. After booking, you'll receive a
                        second confirmation link from the <span className="text-cyan font-medium">SellFi Portal</span> where
                        you'll securely upload verification documents.{' '}
                        <span className="text-tw-text font-medium">Check your email (and spam folder)</span> for this link.
                      </div>
                    </div>
                  </label>

                  {/* Continue button */}
                  <button
                    onClick={() => setStep('booking')}
                    disabled={!canProceedToBooking}
                    className={`w-full py-3.5 font-bold text-sm tracking-[0.06em] uppercase transition-all ${
                      canProceedToBooking
                        ? 'bg-cyan text-dark hover:bg-cyan-light hover:-translate-y-0.5'
                        : 'bg-dark-border text-tw-muted cursor-not-allowed'
                    }`}
                  >
                    Continue to Book a Call
                  </button>
                </div>
              )}

              {/* Step 2: Calendly Booking */}
              {step === 'booking' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar size={20} className="text-cyan" />
                    <div>
                      <h3 className="font-heading text-xl tracking-wide">Book Your Vetting Call</h3>
                      <p className="text-xs text-tw-dim">Pick a time that works. 30-minute call with Mike.</p>
                    </div>
                  </div>

                  <div
                    ref={calendlyRef}
                    className="w-full border border-dark-border overflow-hidden bg-white rounded"
                    style={{ minHeight: '580px' }}
                  />

                  <button
                    onClick={() => setStep('contact')}
                    className="w-full py-2.5 text-sm text-tw-muted hover:text-cyan transition-colors border border-dark-border hover:border-cyan/30"
                  >
                    Skip &mdash; I'll book later
                  </button>
                </div>
              )}

              {/* Step 3: Contact Info */}
              {step === 'contact' && !submitted && (
                <form onSubmit={handleSubmitContact} className="space-y-5">
                  <div className="flex items-center gap-3 mb-2">
                    <Send size={20} className="text-cyan" />
                    <div>
                      <h3 className="font-heading text-xl tracking-wide">Your Contact Info</h3>
                      <p className="text-xs text-tw-dim">So we can follow up with next steps.</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-tw-muted uppercase tracking-wider mb-1.5">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-dark border border-dark-border text-tw-text px-4 py-3 text-sm focus:border-cyan focus:ring-1 focus:ring-cyan/30 outline-none transition-colors"
                      placeholder="John Smith"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-tw-muted uppercase tracking-wider mb-1.5">Email *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-dark border border-dark-border text-tw-text px-4 py-3 text-sm focus:border-cyan focus:ring-1 focus:ring-cyan/30 outline-none transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-tw-muted uppercase tracking-wider mb-1.5">Phone</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-dark border border-dark-border text-tw-text px-4 py-3 text-sm focus:border-cyan focus:ring-1 focus:ring-cyan/30 outline-none transition-colors"
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !name || !email}
                    className={`w-full py-3.5 font-bold text-sm tracking-[0.06em] uppercase transition-all ${
                      isSubmitting || !name || !email
                        ? 'bg-dark-border text-tw-muted cursor-not-allowed'
                        : 'bg-cyan text-dark hover:bg-cyan-light hover:-translate-y-0.5'
                    }`}
                  >
                    {isSubmitting ? 'Sending...' : 'Submit & Get Started'}
                  </button>
                </form>
              )}

              {/* Success state */}
              {step === 'contact' && submitted && (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 bg-cyan/10 border border-cyan/30 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 size={32} className="text-cyan" />
                  </div>
                  <h3 className="font-heading text-2xl tracking-wide">You're In.</h3>
                  <p className="text-sm text-tw-dim max-w-sm mx-auto leading-relaxed">
                    We'll be in touch shortly about the {vehicleTitle}.
                  </p>
                  <div className="bg-cyan/5 border border-cyan/20 p-4 text-left max-w-sm mx-auto space-y-2">
                    <p className="text-xs text-cyan font-semibold uppercase tracking-wider">Next Steps:</p>
                    <ul className="text-xs text-tw-dim space-y-1.5 leading-relaxed">
                      <li className="flex gap-2"><span className="text-cyan shrink-0">1.</span> Check your email for a verification link from the <span className="text-tw-text font-medium">SellFi Portal</span></li>
                      <li className="flex gap-2"><span className="text-cyan shrink-0">2.</span> Upload your verification documents through the secure portal</li>
                      <li className="flex gap-2"><span className="text-cyan shrink-0">3.</span> We'll reach out to schedule your vetting call</li>
                    </ul>
                    <p className="text-[0.65rem] text-tw-muted pt-1">⚠️ Check your spam/junk folder if you don't see it.</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="bg-cyan text-dark font-bold text-sm tracking-[0.06em] uppercase px-8 py-3 hover:bg-cyan-light transition-all"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
