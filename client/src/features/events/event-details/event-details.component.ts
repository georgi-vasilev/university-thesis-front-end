import { Component, inject, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { FormatDatePipe } from '../../../shared/pipes/formate-date.pipe';
import { FormatTimeRangePipe } from '../../../shared/pipes/format-time-range.pipe';
import { EventsService } from '../../../features/events/events.service';
import { TicketPurchaseDialogComponent } from '../ticket-purchase-dialog/ticket-purchase-dialog-component';

@Component({
  standalone: true,
  selector: 'app-event-details',
  imports: [
    CommonModule,
    FormatDatePipe,
    FormatTimeRangePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.scss'
})
export class EventDetailsComponent {
  private route = inject(ActivatedRoute);
  private eventsService = inject(EventsService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  readonly event = toSignal(
    this.route.paramMap.pipe(
      switchMap((params) => {
        const id = params.get('id')!;
        return this.eventsService.getEventById(id);
      })
    ),
    { initialValue: undefined }
  );

  readonly isLoading = computed(() => this.event() === undefined);
  readonly canPurchaseTickets = computed(() => {
    const ev = this.event();
    return ev && ev.status === 'Active' && ev.availableTickets > 0;
  });

  onPurchaseTickets(): void {
    const ev = this.event();
    if (!ev) return;

    const dialogRef = this.dialog.open(TicketPurchaseDialogComponent, {
      width: '600px',
      disableClose: false,
      data: {
        event: {
          id: ev.id,
          name: ev.name,
          date: ev.date,
          venue: ev.venue,
          ticketPrice: ev.generalPrice,
        },
        maxTickets: Math.min(ev.availableTickets, 10)
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      debugger;
      if (result?.success) {
        this.snackBar.open('Tickets purchased successfully! Check your email for more details!', 'Close', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });

        // refresh window for now
        // TODO: implement logic to update the available tickets without refreshing
        window.location.reload();
      }
    });
  }
  onShare(): void {
    if (navigator.share) {
      navigator.share({
        title: this.event()?.name,
        text: `Check out this event: ${this.event()?.name}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      this.snackBar.open('Link copied to clipboard!', 'Close', { duration: 3000 });
    }
  }

  getStatusColor(status: string): string {
    switch (status?.toLowerCase()) {
      case 'active': return 'primary';
      case 'cancelled': return 'warn';
      case 'postponed': return 'accent';
      default: return '';
    }
  }
}
