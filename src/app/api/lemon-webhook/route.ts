
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    const { event_name, data } = await req.json();

    if (event_name === "subscription_created" || event_name === "subscription_updated") {
      const email = data.attributes.user_email;
      const plan = data.attributes.variant_name.toLowerCase(); // 'Pro' -> 'pro'
      let new_limit = 5000;

      if (plan === 'pro') {
        new_limit = 50000;
      } else if (plan === 'business') {
        new_limit = 500000;
      }

      // Find user by email in auth.users
      const { data: authUser, error: authError } = await supabase.from('users').select('id').eq('email', email).single();
      
      if (authError || !authUser) {
        console.error('User not found in auth.users:', email);
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const { error: updateError } = await supabase
        .from('users_extended')
        .update({ plan: plan, rows_limit: new_limit })
        .eq('user_id', authUser.id);
      
      if (updateError) {
        console.error('Error updating user plan:', updateError);
        return NextResponse.json({ error: 'Failed to update plan' }, { status: 500 });
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
