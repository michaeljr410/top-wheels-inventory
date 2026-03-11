/**
 * Serverless function: Send iMessage follow-up via BlueBubbles
 *
 * Sends Mike an iMessage notification about the new lead.
 * Uses BlueBubbles Cloud URL for external access.
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
  const bbChatGuid = (process.env.BLUEBUBBLES_CHAT_GUID || '').trim();

  if (!bbUrl || !bbPassword) {
    console.error('[TOP Wheels iMessage] BlueBubbles not configured');
    return res.status(500).json({ error: 'iMessage service not configured' });
  }

  const { name, email, phone, vehicle, entryFee, monthlyPayment, dealType } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email required' });
  }

  // Build message
  const message = [
    `🚗 NEW TOP WHEELS LEAD`,
    ``,
    `Name: ${name}`,
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : null,
    ``,
    `Vehicle: ${vehicle || 'Unknown'}`,
    entryFee ? `Entry: $${entryFee.toLocaleString()}` : null,
    monthlyPayment ? `Monthly: $${monthlyPayment.toLocaleString()}/mo` : null,
    dealType ? `Type: ${dealType}` : null,
    ``,
    `Source: TOP Wheels Inventory Site`,
  ].filter(Boolean).join('\n');

  try {
    // If we have a chat GUID, send to that chat
    // Otherwise, send to Mike's iMessage email directly
    const endpoint = bbChatGuid
      ? `${bbUrl}/api/v1/chat/${bbChatGuid}/message`
      : `${bbUrl}/api/v1/message/text`;

    const body = bbChatGuid
      ? {
          chatGuid: bbChatGuid,
          message,
          method: 'apple-script',
        }
      : {
          chatGuid: `iMessage;-;${process.env.BLUEBUBBLES_IMESSAGE_EMAIL || 'gold.lock.tke@gmail.com'}`,
          message,
          method: 'apple-script',
        };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...body,
        password: bbPassword,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('[TOP Wheels iMessage] BlueBubbles error:', text);
      return res.status(500).json({ error: 'iMessage send failed' });
    }

    console.log(`[TOP Wheels iMessage] Sent notification for ${name}`);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[TOP Wheels iMessage] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
};
