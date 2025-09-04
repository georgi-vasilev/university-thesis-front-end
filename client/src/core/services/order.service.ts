import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreatePaymentIntentRequest, CreatePaymentIntentResponse, OrderPurchaseCommand } from './order/order.models';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private readonly api = 'http://localhost:5004/api/orders';

  purchaseOrder(request: OrderPurchaseCommand): Observable<void> {
    console.log('Purchasing order with request:', request);
    return this.http.post<void>(`${this.api}/purchase`, request);
  }

  createPaymentIntent(request: CreatePaymentIntentRequest): Observable<CreatePaymentIntentResponse> {
    return this.http.post<CreatePaymentIntentResponse>(`${this.api}/create-payment-intent`, request);
  }

}
