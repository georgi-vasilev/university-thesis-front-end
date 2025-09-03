import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { GetEventsOutputModel } from '../../../features/events/events.model';
import { EventsService } from '../../../features/events/events.service';
import { PaginatedResult } from '../../../shared/models/paginated-result.model';
import { FormatTimeRangePipe } from '../../../shared/pipes/format-time-range.pipe';
import { FormatDatePipe } from '../../../shared/pipes/formate-date.pipe';
import { TruncatePipe } from '../../../shared/pipes/truncate.pipe';

@Component({
  standalone: true,
  selector: 'app-events',
  imports: [
    CommonModule,
    MatButton,
    MatCardModule,
    MatProgressSpinnerModule,
    TruncatePipe,
    FormatDatePipe,
    FormatTimeRangePipe,
  ],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss',
})
export class EventsComponent {
  private eventsService = inject(EventsService);
  private router = inject(Router);
  readonly currentPage = signal(1);
  readonly result = signal<PaginatedResult<GetEventsOutputModel> | null>(null);


  constructor() {
    effect(() => {
      const page = this.currentPage();
      this.eventsService.getAllEvents(page, 8, 0)
        .pipe(
          catchError(() =>
            of({
              items: [],
              pageIndex: 1,
              pageSize: 8,
              totalCount: 0,
              totalPages: 0,
              hasPreviousPage: false,
              hasNextPage: false
            })
          )
        )
        .subscribe((data) => this.result.set(data));
    });
  }

  get pageNumbers() {
    return Array.from({ length: this.result()!.totalPages }, (_, i) => i + 1);
  }

  setPage(page: number) {
    if (page !== this.currentPage()) {
      this.currentPage.set(page);
    }
  }

  onEventClick(event: GetEventsOutputModel): void {
    this.router.navigate(['/events', event.id]);
  }

}

