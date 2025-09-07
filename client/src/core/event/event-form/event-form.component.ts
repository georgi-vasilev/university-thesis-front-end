import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventsService } from '../../../features/events/events.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreateEventModel } from '../../../features/events/create-event.model';
import { Observable } from 'rxjs';
import { VenueService } from '../../../features/venue/venues.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { Venue } from '../../../features/venue/venue.model';

@Component({
  selector: 'app-event-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.scss'
})
export class EventFormComponent {
  private fb = inject(FormBuilder);
  private eventsService = inject(EventsService);
  private venuesService = inject(VenueService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  public venues$!:Observable<Venue[]>;

  form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    date: ['', Validators.required],
    startTime: ['', Validators.required],
    endTime: ['', Validators.required],
    capacity: ['', [Validators.required, Validators.min(1)]],
    venueId: ['', Validators.required],
    posterUrl: ['']
  });

  ngOnInit(): void {
    this.venues$ = this.venuesService.getAll();
  }

  submit() {
    if (this.form.invalid) return;

    const value = this.form.value;
    const payload: CreateEventModel = {
      name: value.name,
      description: value.description,
      date: (value.date as Date).toISOString().split('T')[0],
      startTime: value.startTime,
      endTime: value.endTime,
      venueId: value.venueId,
      capacity: value.capacity
    };
    debugger;
    this.eventsService.createEvent(payload).subscribe({
      next: () => {
        this.snackBar.open('Event created!', 'Close', { duration: 3000 });
        this.router.navigate(['/host/events']);
      },
      error: () => {
        this.snackBar.open('Failed to create event', 'Close', { duration: 3000 });
      }
    });
  }
}
