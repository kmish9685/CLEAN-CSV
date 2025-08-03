
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// These should be in your environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const LEMON_SQUEEZY_WEBHOOK_SECRET = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !LEMON_SQUEEZY_WEBHOOK_SECRET) {
  console.error("Missing required environment variables for Supabase or Lemon Squeezy webhook.");
}

// Use the service role client for elevated privileges to update user data
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

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

    // Handle subscription creation or updates
    if (meta.event_name === "subscription_created" || meta.event_name === "subscription_updated") {
      const userId = meta.custom_data?.user_id;
      if (!userId) {
        console.error("Webhook received without user_id in custom_data");
        return NextResponse.json({ error: 'User ID not found in webhook payload' }, { status: 400 });
      }
      
      const variantName = data.attributes.variant_name.toLowerCase();
      let newPlan = 'free'; // Default to free
      let newLimit = 5000; // Default limit for free plan

      if (variantName.includes('pro')) {
        newPlan = 'pro';
        newLimit = 50000;
      } else if (variantName.includes('business')) {
        newPlan = 'business';
        newLimit = 500000;
      }

      // Update the user's plan and row limit in your database
      const { error: updateError } = await supabaseAdmin
        .from('users_extended')
        .update({ plan: newPlan, rows_limit: newLimit })
        .eq('user_id', userId);
      
      if (updateError) {
        console.error(`Error updating plan for user ${userId}:`, updateError);
        return NextResponse.json({ error: 'Failed to update user plan' }, { status: 500 });
      }
      
      console.log(`Successfully updated plan for user ${userId} to ${newPlan}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: `Internal Server Error: ${error.message}` }, { status: 500 });
  }
}
