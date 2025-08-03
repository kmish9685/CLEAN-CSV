
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// These are sensitive and should be in environment variables
const SUPABASE_URL = "https://ncrgcgcuucfcntjqqizn.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY; // You MUST set this in your project's environment variables
const LEMON_SQUEEZY_WEBHOOK_SECRET = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET; // You MUST set this in your project's environment variables

if (!SUPABASE_SERVICE_ROLE_KEY || !LEMON_SQUEEZY_WEBHOOK_SECRET) {
  console.error("Missing required environment variables for Lemon Squeezy webhook.");
}

// Use the service role client for elevated privileges
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(req: NextRequest) {
  if (!LEMON_SQUEEZY_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  try {
    const rawBody = await req.text();
    const hmac = crypto.createHmac('sha256', LEMON_SQUEEZY_WEBHOOK_SECRET);
    const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
    const signature = Buffer.from(req.headers.get('X-Signature') || '', 'utf8');

    if (!crypto.timingSafeEqual(digest, signature)) {
      console.warn("Invalid Lemon Squeezy webhook signature.");
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const { meta, data } = JSON.parse(rawBody);

    if (meta.event_name === "subscription_created" || meta.event_name === "subscription_updated") {
      const userId = meta.custom_data?.user_id;
      if (!userId) {
        console.error("Webhook missing user_id in custom_data");
        return NextResponse.json({ error: 'User ID not found in webhook payload' }, { status: 400 });
      }
      
      const variantName = data.attributes.variant_name.toLowerCase();
      let newPlan = 'free';
      let newLimit = 5000;

      if (variantName.includes('pro')) {
        newPlan = 'pro';
        newLimit = 50000;
      } else if (variantName.includes('business')) {
        newPlan = 'business';
        newLimit = 500000;
      }

      const { error: updateError } = await supabaseAdmin
        .from('users_extended')
        .update({ plan: newPlan, rows_limit: newLimit })
        .eq('user_id', userId);
      
      if (updateError) {
        console.error(`Error updating plan for user ${userId}:`, updateError);
        return NextResponse.json({ error: 'Failed to update plan' }, { status: 500 });
      }
      console.log(`Successfully updated plan for user ${userId} to ${newPlan}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: `Internal Server Error: ${error.message}` }, { status: 500 });
  }
}
