import { Component, Inject, OnInit, signal, inject, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Stripe, StripeElements, StripePaymentElement } from '@stripe/stripe-js';
import { OrderService } from '../../../core/services/order.service';
import { PaymentService } from '../../../core/services/payment.service';
import { CreatePaymentIntentRequest, OrderPurchaseCommand } from '../../../core/services/order/order.models';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';

export interface TicketPurchaseData {
  event: any;
  maxTickets: number;
}

@Component({
  standalone: true,
  selector: 'app-ticket-purchase-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatStepperModule
  ],
  templateUrl: './ticket-purchase-dialog-component.html',
  styleUrl: './ticket-purchase-dialog-component.scss'
})
export class TicketPurchaseDialogComponent implements OnInit {
  @ViewChild('paymentElement', { static: false }) paymentElementRef!: ElementRef;
  @ViewChild('stepper', { static: false }) stepper!: MatStepper;

  private fb = inject(FormBuilder);
  private orderService = inject(OrderService);
  private paymentService = inject(PaymentService);
  private snackBar = inject(MatSnackBar);
  private paymentIntentId!: string | undefined;

  ticketForm: FormGroup;
  isProcessing = signal(false);
  processingMessage = signal('');
  paymentReady = signal(false);
  purchaseSuccess = signal(false);
  purchaseError = signal('');
  orderResult = signal<{ orderId: string } | null>(null);
  quantity: number = 0;

  private stripe: Stripe | null = null;
  private elements: StripeElements | null = null;
  private paymentElement: StripePaymentElement | null = null;

  constructor(
    public dialogRef: MatDialogRef<TicketPurchaseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TicketPurchaseData
  ) {
    this.ticketForm = this.fb.group({
      ticketQuantity: [1, [Validators.required, Validators.min(1), Validators.max(this.data.maxTickets)]],
      ticketType: ['General', Validators.required]
    });
  }

  async ngOnInit(): Promise<void> {
    // stripe initialization
    this.stripe = await this.paymentService.initializeStripe();
    if (!this.stripe) {
      this.snackBar.open('Failed to initialize payment system', 'Close', { duration: 5000 });
    }
  }

  proceedToPayment(): void {
    this.stepper.next();

    setTimeout(() => {
      this.initializePaymentElement();
    }, 200);
  }

  get totalAmount(): number {
    this.quantity = this.ticketForm.get('ticketQuantity')?.value || 1;
    return this.quantity * this.data.event.ticketPrice;
  }

  get ticketQuantityOptions(): number[] {
    return Array.from({ length: this.data.maxTickets }, (_, i) => i + 1);
  }

  async initializePaymentElement(): Promise<void> {
    if (!this.stripe) return;

    this.isProcessing.set(true);
    this.processingMessage.set('Initializing payment...');

    try {
      const paymentElementDiv = document.querySelector('.payment-element') as HTMLElement;

      if (!paymentElementDiv) {
        throw new Error('Payment element not found in template');
      }

      const paymentIntentRequest: CreatePaymentIntentRequest = {
        eventId: this.data.event.id,
        amount: this.totalAmount,
        ticketQuantity: this.ticketForm.get('ticketQuantity')?.value || 1,
        ticketType: this.ticketForm.get('ticketType')?.value || 'General'
      };

      const response = await this.orderService
        .createPaymentIntent(paymentIntentRequest).toPromise();

      const appearance = {
        theme: 'stripe' as const,
        variables: {
          colorPrimary: '#1976d2'
        }
      };

      this.elements = this.stripe.elements({
        clientSecret: response!.clientSecret,
        appearance
      });

      this.paymentElement = this.elements.create('payment');
      this.paymentElement.mount(paymentElementDiv);

      this.paymentElement.on('ready', () => {
        this.paymentReady.set(true);
        this.isProcessing.set(false);
      });

      this.paymentIntentId = response!.paymentIntentId;

    } catch (error) {
      console.error('Error initializing payment element:', error);
      this.isProcessing.set(false);
      this.purchaseError.set('Failed to initialize payment');
    }
  }

  async onPurchase(): Promise<void> {
    if (!this.stripe || !this.elements || !this.ticketForm.valid) {
      return;
    }

    this.isProcessing.set(true);
    this.processingMessage.set('Processing payment...');

    try {
      const orderRequest: OrderPurchaseCommand = {
        eventId: this.data.event.id,
        quantity: this.quantity,
        ticketType: this.ticketForm.get('ticketType')?.value || 'General',
        paymentIntentId: this.paymentIntentId!,
      };

      await this.orderService.purchaseOrder(orderRequest).toPromise();

      const { error } = await this.stripe.confirmPayment({
        elements: this.elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
        redirect: 'if_required'
      });

      if (error) {
        console.error('confirmation error:', error);
        this.purchaseError.set(error.message || 'Payment failed');
        this.isProcessing.set(false);
      } else {
        this.purchaseSuccess.set(true);
        this.orderResult.set({ orderId: this.paymentIntentId! });
        this.isProcessing.set(false);
        this.dialogRef.close({ success: true });
      }

    } catch (error: any) {
      console.error('Purchase error:', error);
      this.purchaseError.set(error.error?.message || 'Purchase failed. Please try again.');
      this.isProcessing.set(false);
    }
  }

  onClose(): void {
    this.dialogRef.close({
      success: this.purchaseSuccess(),
      orderId: this.orderResult()?.orderId
    });
  }

  onCancel(): void {
    this.dialogRef.close({ success: false });
  }
}
