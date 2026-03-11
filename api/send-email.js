/**
 * Serverless function: Send follow-up email via Resend
 *
 * Sends two emails:
 * 1. Confirmation to the buyer
 * 2. Notification to Mike about the new lead
 */

const { Resend } = require('resend');

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const resendKey = (process.env.RESEND_API_KEY || '').trim();
  if (!resendKey) {
    console.error('[TOP Wheels Email] RESEND_API_KEY not configured');
    return res.status(500).json({ error: 'Email service not configured' });
  }

  const resend = new Resend(resendKey);
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'TOP Wheels <noreply@topwheels.io>';
  const mikeEmail = process.env.MIKE_EMAIL || 'vivantinvestments@gmail.com';

  const { name, email, phone, vehicle, entryFee, monthlyPayment, dealType } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email required' });
  }

  try {
    // 1. Confirmation to buyer
    await resend.emails.send({
      from: fromEmail,
      to: email,
      reply_to: mikeEmail,
      subject: `You're in — ${vehicle || 'Vehicle'} inquiry received`,
      html: `
        <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #060B18; color: #E2E8F0; padding: 40px 30px;">
          <div style="font-family: 'Bebas Neue', Arial; font-size: 28px; letter-spacing: 0.08em; margin-bottom: 8px;">
            <span style="color: #0EA5E9;">TOP</span> <span>WHEELS</span>
          </div>
          <div style="width: 40px; height: 2px; background: #0EA5E9; margin-bottom: 30px;"></div>

          <h2 style="font-size: 20px; margin-bottom: 16px;">Hey ${name.split(' ')[0] || name},</h2>

          <p style="color: #8494A7; line-height: 1.7; margin-bottom: 20px;">
            We got your inquiry about the <strong style="color: #E2E8F0;">${vehicle || 'vehicle'}</strong>.
            ${entryFee ? `Entry fee: <strong style="color: #0EA5E9;">$${entryFee.toLocaleString()}</strong>` : ''}
            ${monthlyPayment ? ` | Monthly: <strong style="color: #0EA5E9;">$${monthlyPayment.toLocaleString()}/mo</strong>` : ''}
          </p>

          <p style="color: #8494A7; line-height: 1.7; margin-bottom: 20px;">
            Here's what happens next:
          </p>
          <ul style="color: #8494A7; line-height: 1.8; margin-bottom: 24px; padding-left: 20px;">
            <li>If you booked a call, we'll see you there.</li>
            <li>If not, expect a call or text from Mike within 24 hours.</li>
            <li>We'll walk you through the deal structure and next steps.</li>
          </ul>

          <div style="background: #0A1020; border: 1px solid #152040; padding: 16px; margin-bottom: 24px;">
            <p style="color: #4A5568; font-size: 12px; margin: 0;">
              This is a creative finance deal${dealType ? ` (${dealType})` : ''}. No bank approval needed.
              All transactions are facilitated by TOP Wheels (Vivant Investments LLC).
            </p>
          </div>

          <p style="color: #4A5568; font-size: 12px; font-style: italic;">
            "Own more, bank less." — Mike Davis
          </p>
        </div>
      `,
    });

    // 2. Notification to Mike
    await resend.emails.send({
      from: fromEmail,
      to: mikeEmail,
      subject: `🚗 New Lead: ${name} — ${vehicle || 'Unknown Vehicle'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #0EA5E9;">New TOP Wheels Lead</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Name</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${name}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Email</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${email}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Phone</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${phone || 'Not provided'}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Vehicle</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${vehicle || 'Unknown'}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Entry Fee</td><td style="padding: 8px; border-bottom: 1px solid #eee;">$${entryFee?.toLocaleString() || 'N/A'}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Monthly</td><td style="padding: 8px; border-bottom: 1px solid #eee;">$${monthlyPayment?.toLocaleString() || 'N/A'}/mo</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Deal Type</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${dealType || 'N/A'}</td></tr>
          </table>
          <p style="margin-top: 20px; color: #666;">Source: TOP Wheels Inventory Site</p>
        </div>
      `,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[TOP Wheels Email] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
};
