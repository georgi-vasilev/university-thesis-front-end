import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsService } from '../../events/events.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TruncatePipe } from '../../../shared/pipes/truncate.pipe';
import { FormatDatePipe } from '../../../shared/pipes/formate-date.pipe';
import { FormatTimeRangePipe } from '../../../shared/pipes/format-time-range.pipe';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { GetEventsOutputModel } from '../../events/events.model';
import { PaginatedResult } from '../../../shared/models/paginated-result.model';

@Component({
  standalone: true,
  selector: 'app-host-events',
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    TruncatePipe,
    FormatDatePipe,
    FormatTimeRangePipe
  ]
})
export class HostEventsComponent {
  private eventsService = inject(EventsService);
  private router = inject(Router);
  readonly currentPage = signal(1);
  readonly result = signal<PaginatedResult<GetEventsOutputModel> | null>(null);

  constructor() {
    effect(() => {
      const page = this.currentPage();
      this.eventsService.getEventsByHostId(page, 8, 0)
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

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'active':
        return 'active';
      case 'cancelled':
        return 'cancelled';
      case 'postponed':
        return 'postponed';
      default:
        return '';
    }
  }

  editEvent(event: GetEventsOutputModel): void {
    this.router.navigate(['/events/edit', event.id]);
  }

  cancelEvent(event: GetEventsOutputModel): void {
    debugger;
    this.eventsService.cancelEvent(event.id).subscribe({
      next: () => {
        this.currentPage.set(this.currentPage());
      },
      error: () => {
        alert('Failed to cancel event.');
      }
    });
  }
}

