/**
 * Serverless function: Calendly Webhook → BlueBubbles SMS
 *
 * Register this URL in Calendly's webhook settings:
 *   https://subtocarguy.com/api/calendly-webhook
 *
 * When a buyer books a call through Calendly, this:
 * 1. Extracts their name, phone, and vehicle info
 * 2. Sends them a follow-up SMS from Mike's number
 * 3. Sends Mike an iMessage notification
 *
 * Calendly webhook events: invitee.created, invitee.canceled
 */

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const bbUrl = (process.env.BLUEBUBBLES_CLOUD_URL || '').trim();
  const bbPassword = (process.env.BLUEBUBBLES_PASSWORD || '').trim();

  if (!bbUrl || !bbPassword) {
    console.error('[Calendly Webhook] BlueBubbles not configured');
    return res.status(200).json({ ok: true, note: 'SMS service not configured' });
  }

  try {
    const body = req.body || {};
    const event = body.event;

    // Only handle new bookings
    if (event !== 'invitee.created') {
      return res.status(200).json({ ok: true, skipped: true });
    }

    const payload = body.payload || {};
    const invitee = payload.invitee || payload;

    // Extract info
    const fullName = invitee.name || invitee.first_name || '';
    const firstName = fullName.split(' ')[0] || 'there';
    const email = invitee.email || '';
    const phone = invitee.text_reminder_number || invitee.phone_number || '';

    // Try to extract vehicle from custom questions
    const questions = invitee.questions_and_answers || payload.questions_and_answers || [];
    let vehicleInfo = '';
    for (const q of questions) {
      const answer = q.answer || '';
      if (answer.toLowerCase().includes('vehicle') || answer.includes('$')) {
        vehicleInfo = answer.replace(/^Vehicle:\s*/i, '');
        break;
      }
    }

    console.log(`[Calendly Webhook] Booking: ${firstName} (${email}) ${phone ? `ph:${phone}` : 'no phone'}`);

    const promises = [];

    // 1. Send buyer follow-up SMS (if we have their phone)
    if (phone) {
      let cleanPhone = phone.replace(/[^0-9+]/g, '');
      if (cleanPhone.length === 10) cleanPhone = '+1' + cleanPhone;
      if (!cleanPhone.startsWith('+')) cleanPhone = '+' + cleanPhone;

      const buyerMsg = [
        `Hey ${firstName}! 👋`,
        ``,
        `Just got your booking${vehicleInfo ? ` for the ${vehicleInfo}` : ''} — looking forward to chatting with you!`,
        ``,
        `Quick heads up — check your email (and spam) for a verification link from the SellFi Portal. That's where you'll upload your verification docs so we can move things forward.`,
        ``,
        `This is my direct number — feel free to text or call anytime.`,
        ``,
        `Talk soon!`,
        `- Mike`,
      ].join('\n');

      promises.push(
        fetch(`${bbUrl}/api/v1/message/text`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chatGuid: `iMessage;-;${cleanPhone}`,
            message: buyerMsg,
            method: 'apple-script',
            password: bbPassword,
          }),
        }).catch(err => console.error('[Calendly Webhook] Buyer SMS error:', err.message))
      );
    }

    // 2. Send Mike a notification
    const mikeMsg = [
      `📅 NEW CALENDLY BOOKING`,
      ``,
      `Name: ${fullName}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : 'Phone: Not provided',
      vehicleInfo ? `Vehicle: ${vehicleInfo}` : '',
      ``,
      `Source: TOP Wheels Inventory (subtocarguy.com)`,
      phone ? `✅ Buyer SMS sent` : `⚠️ No phone — couldn't send buyer SMS`,
    ].filter(Boolean).join('\n');

    const mikeTarget = process.env.BLUEBUBBLES_IMESSAGE_EMAIL || 'gold.lock.tke@gmail.com';
    promises.push(
      fetch(`${bbUrl}/api/v1/message/text`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatGuid: `iMessage;-;${mikeTarget}`,
          message: mikeMsg,
          method: 'apple-script',
          password: bbPassword,
        }),
      }).catch(err => console.error('[Calendly Webhook] Mike notify error:', err.message))
    );

    await Promise.allSettled(promises);

    return res.status(200).json({ ok: true, buyer_sms: !!phone });
  } catch (err) {
    console.error('[Calendly Webhook] Error:', err.message);
    // Always return 200 to Calendly so it doesn't retry endlessly
    return res.status(200).json({ ok: false, error: err.message });
  }
};
