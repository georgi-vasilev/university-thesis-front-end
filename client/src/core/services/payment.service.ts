import { Injectable } from '@angular/core';
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private stripe: Stripe | null = null;

  async initializeStripe(): Promise<Stripe | null> {
    if (!this.stripe) {
      this.stripe = await loadStripe(environment.stripePublishableKey);
    }
    return this.stripe;
  }

  async createPaymentElement(clientSecret: string): Promise<StripeElements | null> {
    const stripe = await this.initializeStripe();
    if (!stripe) return null;

    return stripe.elements({
      clientSecret,
      appearance: {
        theme: 'stripe',
        variables: {
          colorPrimary: '#1976d2',
          colorBackground: '#ffffff',
          colorText: '#333333',
          borderRadius: '8px'
        }
      }
    });
  }
}
