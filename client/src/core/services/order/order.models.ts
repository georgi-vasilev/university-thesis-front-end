export interface OrderPurchaseCommand {
  eventId: string;
  quantity: number;
  ticketType: string;
  paymentIntentId: string;
}

export interface CreatePaymentIntentRequest {
  eventId: string;
  amount: number;
  ticketQuantity: number;
  ticketType: string;
}

export interface CreatePaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}
