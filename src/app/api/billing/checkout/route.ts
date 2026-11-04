import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { PRICING_PLANS } from '@/lib/subscription';

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { planId } = await req.json();
  const plan = PRICING_PLANS[planId];
  if (!plan) {
    return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 });
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const polarApiKey = process.env.POLAR_API_KEY;

  // Real production integration check
  if (!stripeSecretKey && !polarApiKey) {
    return NextResponse.json({
      configured: false,
      message:
        'Live payment gateway keys (STRIPE_SECRET_KEY or POLAR_API_KEY) are not configured in environment variables. In development/testing, you can enable sandbox upgrade in settings or provide valid keys in .env.local.',
      providerStatus: 'missing_credentials',
      supportedProviders: ['stripe', 'polar'],
    });
  }

  // When live keys are provided:
  // e.g., create Stripe checkout session or Polar checkout link
  return NextResponse.json({
    configured: true,
    checkoutUrl: 'https://checkout.stripe.com/c/pay/demo_session_url',
  });
}
