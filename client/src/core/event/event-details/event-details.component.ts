import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { FormatDatePipe } from '../../../shared/pipes/formate-date.pipe';
import { FormatTimeRangePipe } from '../../../shared/pipes/format-time-range.pipe';
import { EventsService } from '../../../features/events/events.service';

@Component({
  standalone: true,
  selector: 'app-event-details',
  imports: [CommonModule, FormatDatePipe, FormatTimeRangePipe],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.scss'
})
export class EventDetailsComponent {
  private route = inject(ActivatedRoute);
  private eventsService = inject(EventsService);
  readonly event = toSignal(
    this.route.paramMap.pipe(
      switchMap((params) => {
        const id = params.get('id')!;
        return this.eventsService.getEventById(id);
      })
    ),
    { initialValue: undefined }
  );
}

