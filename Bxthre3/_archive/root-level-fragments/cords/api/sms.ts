// SignalWire SMS API for Cords
// Usage: send order confirmations, delivery alerts, supplier notifications

interface SMSConfig {
  to: string;
  body: string;
  from?: string;
}

export async function sendSMS({ to, body, from }: SMSConfig): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const projectId = process.env.SIGNALWIRE_PROJECT_ID;
  const apiToken = process.env.SIGNALWIRE_API_TOKEN;
  const spaceUrl = process.env.SIGNALWIRE_SPACE_URL;
  const defaultFrom = process.env.SIGNALWIRE_FROM_NUMBER;

  if (!projectId || !apiToken || !spaceUrl) {
    return { success: false, error: 'SignalWire credentials not configured' };
  }

  const fromNumber = from || defaultFrom || '+15551234567';

  try {
    const auth = Buffer.from(`${projectId}:${apiToken}`).toString('base64');
    
    const response = await fetch(`https://${spaceUrl}/api/laml/2010-04-01/Accounts/${projectId}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: to,
        From: fromNumber,
        Body: body,
      }),
    });

    const data = await response.json();
    
    if (response.ok) {
      return { success: true, messageId: data.sid };
    } else {
      return { success: false, error: data.message || 'SMS send failed' };
    }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

// Cords-specific SMS templates
export const cordsSMS = {
  orderConfirmed: (orderId: string, supplier: string, date: string) => ({
    to: '', // customer phone
    body: `🔥 Cords Order #${orderId.slice(-6)} confirmed! ${supplier} will deliver on ${date}. Track at brodiblanco.zo.space/cords`,
  }),
  
  deliveryReminder: (orderId: string, date: string, timeWindow: string) => ({
    to: '',
    body: `🔥 Your Cords delivery #${orderId.slice(-6)} is scheduled for ${date} between ${timeWindow}. Reply CONFIRM to confirm availability.`,
  }),
  
  supplierNewOrder: (orderId: string, customer: string, woodType: string, quantity: number) => ({
    to: '',
    body: `🔥 New Cords order! ${customer} wants ${quantity}x ${woodType}. Order #${orderId.slice(-6)}. Accept: brodiblanco.zo.space/cords/supplier`,
  }),
  
  supplierReminder: (orderId: string, customer: string, address: string, date: string) => ({
    to: '',
    body: `🔥 Delivery today: ${customer} at ${address}. Order #${orderId.slice(-6)}. GPS: brodiblanco.zo.space/cords/nav`,
  }),
};
