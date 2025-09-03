import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Host } from '../models/host.model';
import { Observable } from 'rxjs';
import { Buyer } from './buyer.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = 'http://localhost:5004/api/Auth';

  constructor(private http: HttpClient) { }

  registerHost(data: Host): Observable<string> {
    return this.http.post(`${this.api}/RegisterHost`, data, { responseType: 'text' });
  }

  registerBuyer(data: Buyer): Observable<string> {
    return this.http.post(`${this.api}/RegisterBuyer`, data, { responseType: 'text' });
  }

  login(data: { email: string; password: string }): Observable<string> {
    return this.http.post(`${this.api}/Login`, data, {
      responseType: 'text',
    });
  }
}
