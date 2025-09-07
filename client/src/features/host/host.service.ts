import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HostDetails } from './host.details.model';

@Injectable({
  providedIn: 'root'
})
export class HostService {
  private readonly api = 'http://localhost:5004/api';

  constructor(private http: HttpClient) { }

  getHostDetailsById(id: string): Observable<HostDetails> {
    return this.http.get<HostDetails>(`${this.api}/hosts/details/${id}`);
  }
}

