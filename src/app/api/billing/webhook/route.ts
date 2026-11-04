import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json(
      { error: 'Webhook secret not configured on server.' },
      { status: 500 }
    );
  }

  try {
    const rawBody = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing webhook signature' }, { status: 400 });
    }

    // In production with stripe installed:
    // const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    // Handle customer.subscription.created, updated, deleted...

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Webhook verification error:', err.message);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }
}
