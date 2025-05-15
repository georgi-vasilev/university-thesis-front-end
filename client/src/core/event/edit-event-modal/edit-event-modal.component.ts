import { Component, inject, Inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { EventsService } from '../../../features/events/events.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, of } from 'rxjs';
import { Venue } from '../../../features/venue/venue.model';

@Component({
  selector: 'app-edit-event-modal',
  standalone: true,
  templateUrl: './edit-event-modal.component.html',
  styleUrls: ['./edit-event-modal.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule
  ]
})
export class EditEventModalComponent implements OnInit {
  venues$!: Observable<Venue[]>;

  fb = inject(FormBuilder);
  http = inject(HttpClient);
  dialogRef = inject(MatDialogRef<EditEventModalComponent>)
  eventService = inject(EventsService);
  form = this.fb.group({
    name: this.fb.control<string>('', Validators.required),
    description: this.fb.control<string>(''),
    date: this.fb.control<Date | null>(null, Validators.required),
    startTime: this.fb.control<Date | null>(null, Validators.required),
    endTime: this.fb.control<Date | null>(null, Validators.required),
    venueId: this.fb.control<string | null>(null, Validators.required)
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { event: any },
  ) {
    this.venues$ = this.http.get<Venue[]>('http://localhost:5004/api/Venues/all');
  }

  ngOnInit(): void {

    const { name, description, date, startTime, endTime, venueId } = this.data.event;

    this.form.patchValue({
      name,
      description,
      date: new Date(date),
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      venueId
    });
  }

  save(): void {
    if (this.form.valid) {
      this.dialogRef.close({
        ...this.form.value,
        eventId: this.data.event.id
      });
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}

