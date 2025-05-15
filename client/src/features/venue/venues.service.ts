import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Venue } from './venue.model';

@Injectable({
  providedIn: 'root',
})
export class VenueService {
  private readonly api = 'http://localhost:5004/api';
  private readonly get_all = `${this.api}/venues/all`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Venue[]> {
    return this.http.get<Venue[]>(this.get_all);
  }
}


