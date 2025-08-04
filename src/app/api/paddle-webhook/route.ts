
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';

// Make sure to set these in your Vercel environment variables
const PADDLE_WEBHOOK_SECRET = process.env.PADDLE_WEBHOOK_SECRET;

// Define a mapping from Paddle Price ID to your internal plan names
const priceIdToPlan: { [key: string]: string } = {
  [process.env.NEXT_PUBLIC_PADDLE_PRO_PRICE_ID || '']: 'pro',
  [process.env.NEXT_PUBLIC_PADDLE_BUSINESS_PRICE_ID || '']: 'business',
};

const priceIdToRowsLimit: { [key: string]: number } = {
    [process.env.NEXT_PUBLIC_PADDLE_PRO_PRICE_ID || '']: 50000,
    [process.env.NEXT_PUBLIC_PADDLE_BUSINESS_PRICE_ID || '']: 500000,
};


export async function POST(req: NextRequest) {
  if (!PADDLE_WEBHOOK_SECRET) {
    console.error('Paddle webhook secret is not configured.');
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }

  try {
    const signature = req.headers.get('paddle-signature') || '';
    const body = await req.text();
    
    // --- Webhook verification ---
    const [ts, h1] = signature.split(';').reduce(
      (acc, part) => {
        const [key, value] = part.split('=');
        if (key && value) {
          acc[key as 'ts' | 'h1'] = value;
        }
        return acc;
      },
      { ts: '', h1: '' }
    );

    if (!ts || !h1) {
      return NextResponse.json({ error: 'Invalid signature header' }, { status: 400 });
    }

    const signedPayload = `${ts}:${body}`;
    const expectedSignature = crypto
        .createHmac('sha256', PADDLE_WEBHOOK_SECRET)
        .update(signedPayload)
        .digest('hex');
    
    if (h1 !== expectedSignature) {
        return NextResponse.json({ error: 'Signature verification failed' }, { status: 401 });
    }
    // --- End Webhook verification ---

    const event = JSON.parse(body);

    // We only care about successful subscription creations for this example
    if (event.event_type === 'subscription.created') {
      const { custom_data, items, customer_id } = event.data;
      const userId = custom_data?.user_id;
      const priceId = items[0]?.price_id;

      if (!userId || !priceId) {
        return NextResponse.json({ error: 'Missing user_id or price_id in webhook payload' }, { status: 400 });
      }

      const planName = priceIdToPlan[priceId];
      const newRowsLimit = priceIdToRowsLimit[priceId];

      if (!planName || !newRowsLimit) {
        return NextResponse.json({ error: `Unrecognized price_id: ${priceId}` }, { status: 400 });
      }

      const cookieStore = cookies();
      const supabase = createClient(cookieStore);

      // Update the user's record in your database
      const { error } = await supabase
        .from('users_extended')
        .update({ 
            plan: planName,
            rows_limit: newRowsLimit,
            paddle_customer_id: customer_id 
        })
        .eq('user_id', userId);

      if (error) {
        console.error('Supabase update error:', error);
        return NextResponse.json({ error: 'Failed to update user plan' }, { status: 500 });
      }

      return NextResponse.json({ received: true });
    }

    return NextResponse.json({ message: 'Event received, but no action taken.' });

  } catch (err: any) {
    console.error('Webhook Error