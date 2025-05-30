import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginatedResult } from '../../shared/models/paginated-result.model';
import { EventDetailsOutputModel } from './event-details.model';
import { GetEventsOutputModel } from './events.model';
import { UpdateEventCommandModel } from './update-event-command.model';
import { CreateEventModel } from './create-event.model';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private readonly api = 'http://localhost:5004/api';
  private readonly get_all = `${this.api}/events/all`;

  constructor(private http: HttpClient) { }

  getAllEvents(
    pageIndex: number = 1,
    pageSize: number = 8,
    ordering: number = 0
  ): Observable<PaginatedResult<GetEventsOutputModel>> {
    const params = new HttpParams()
      .set('PageIndex', pageIndex)
      .set('PageSize', pageSize)
      .set('Ordering', ordering);

    return this.http.get<PaginatedResult<GetEventsOutputModel>>(this.get_all, { params });
  }

  getEventById(id: string): Observable<EventDetailsOutputModel> {
    return this.http.get<EventDetailsOutputModel>(`${this.api}/events/details/${id}`);
  }

  getEventsByHostId(
    pageIndex: number = 1,
    pageSize: number = 2,
    ordering: number = 0
  ): Observable<PaginatedResult<GetEventsOutputModel>> {
    const params = new HttpParams()
      .set('PageIndex', pageIndex)
      .set('PageSize', pageSize)
      .set('Ordering', ordering);

    return this.http.get<PaginatedResult<GetEventsOutputModel>>(`${this.api}/events/host`, { params });
  }

  cancelEvent(id: string): Observable<void> {
    return this.http.post<void>(`${this.api}/events/cancel/`, { id: id });
  }

  createEvent(command: CreateEventModel): Observable<object> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(`${this.api}/events/create`, command, { headers })
  }

  updateEvent(updatedEvent: UpdateEventCommandModel) {
    const id = updatedEvent.eventId;
    return this.http.put<UpdateEventCommandModel>(`${this.api}/events/${id}`, { updatedEvent });
  }

}

