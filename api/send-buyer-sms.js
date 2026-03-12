/**
 * Serverless function: Send follow-up SMS to buyer via BlueBubbles
 *
 * When a buyer submits their contact info, this sends them a text
 * from Mike's phone number via BlueBubbles.
 * Includes SellFi Portal verification reminder.
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
    console.error('[Buyer SMS] BlueBubbles not configured');
    return res.status(500).json({ error: 'SMS service not configured' });
  }

  const { name, phone, vehicle } = req.body;

  if (!phone) {
    return res.status(400).json({ error: 'Phone number required' });
  }

  // Extract first name
  const firstName = (name || 'there').split(' ')[0];

  // Build personalized follow-up message
  const message = [
    `Hey ${firstName}! 👋`,
    ``,
    `Just got your inquiry in${vehicle ? ` for the ${vehicle}` : ''}. Excited to chat with you about it!`,
    ``,
    `Quick heads up — check your email (and spam) for a verification link from the SellFi Portal. That's where you'll upload your verification docs so we can move things forward.`,
    ``,
    `This is my direct number — feel free to text or call anytime.`,
    ``,
    `Talk soon!`,
    `- Mike`,
  ].join('\n');

  try {
    // Clean phone number — strip non-digits, ensure country code
    let cleanPhone = phone.replace(/[^0-9+]/g, '');
    if (cleanPhone.length === 10) cleanPhone = '+1' + cleanPhone;
    if (!cleanPhone.startsWith('+')) cleanPhone = '+' + cleanPhone;

    const response = await fetch(`${bbUrl}/api/v1/message/text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chatGuid: `iMessage;-;${cleanPhone}`,
        message,
        method: 'apple-script',
        password: bbPassword,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('[Buyer SMS] BlueBubbles error:', text);
      // Try SMS fallback (if iMessage fails, try SMS chat GUID)
      const smsResponse = await fetch(`${bbUrl}/api/v1/message/text`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatGuid: `SMS;-;${cleanPhone}`,
          message,
          method: 'apple-script',
          password: bbPassword,
        }),
      });

      if (!smsResponse.ok) {
        const smsText = await smsResponse.text();
        console.error('[Buyer SMS] SMS fallback also failed:', smsText);
        return res.status(500).json({ error: 'SMS send failed' });
      }
    }

    console.log(`[Buyer SMS] Sent follow-up to ${firstName} at ${cleanPhone}`);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[Buyer SMS] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
};
