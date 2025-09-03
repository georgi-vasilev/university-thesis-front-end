import { Routes } from '@angular/router';
import { HostEventsComponent } from '../features/host/events/host-events.component';
import { EventsComponent } from '../features/events/events/events.component';
import { EventDetailsComponent } from '../features/events/event-details/event-details.component';
import { EventFormComponent } from '../features/events/event-form/event-form.component';

export const routes: Routes = [
  {
    path: 'events',
    component: EventsComponent
  },
  {
    path: 'events/:id',
    component: EventDetailsComponent,
  },
  {
    path: 'host/events',
    component: HostEventsComponent,
  },
  {
    path: 'host/events/new',
    component: EventFormComponent,
  },
  { path: '**', redirectTo: '' },

];
