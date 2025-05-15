import { Component, effect, inject, signal } from '@angular/core';
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
import { GetEventsOutputModel } from '../../events/events.model';
import { PaginatedResult } from '../../../shared/models/paginated-result.model';
import { EditEventModalComponent } from '../../../core/event/edit-event-modal/edit-event-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  standalone: true,
  selector: 'app-host-events',
  templateUrl: './host-events.component.html',
  styleUrl: './host-events.component.scss',
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
  private dialog = inject(MatDialog);
  private eventsService = inject(EventsService);
  private router = inject(Router);
  readonly currentPage = signal(1);
  readonly result = signal<PaginatedResult<GetEventsOutputModel> | null>(null);
  private fetchEvents() {
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
  }
  constructor() {
    effect(() => {
      this.fetchEvents();
    });
  }

  get pageNumbers() {
    return Array.from({ length: this.result()!.totalPages }, (_, i) => i + 1);
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
    const dialogRef = this.dialog.open(EditEventModalComponent, {
      width: '900px',
      height: 'auto',
      maxHeight: '90vh',
      data: { event }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.eventsService.updateEvent(result)
          .subscribe(() => {
            this.fetchEvents();
          });
      }
    });
  }

  setPage(page: number) {
    if (page !== this.currentPage()) {
      this.currentPage.set(page);
    } else {
      this.fetchEvents();
    }
  }

  cancelEvent(event: GetEventsOutputModel): void {
    this.eventsService.cancelEvent(event.id).subscribe({
      next: () => {
        this.fetchEvents();
      },
      error: () => {
        alert('Failed to cancel event.');
      }
    });
  }
}

