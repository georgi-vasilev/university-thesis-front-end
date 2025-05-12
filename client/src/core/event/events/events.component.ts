import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { TruncatePipe } from '../../../shared/pipes/truncate.pipe';
import { FormatDatePipe } from '../../../shared/pipes/formate-date.pipe';
import { FormatTimeRangePipe } from '../../../shared/pipes/format-time-range.pipe';
import { EventsService } from '../../../features/events/events.service';
import { GetEventsOutputModel } from '../../../features/events/events.model';

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

  private eventsResult$ = computed(() =>
    this.eventsService.getAllEvents(this.currentPage(), 8, 0).pipe(
      catchError((err) => {
        console.error('Failed to load events', err);
        return of({
          items: [],
          pageIndex: 1,
          pageSize: 8,
          totalCount: 0,
          totalPages: 0,
          hasPreviousPage: false,
          hasNextPage: false
        });
      })
    )
  );

  readonly result = toSignal(this.eventsResult$());

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

