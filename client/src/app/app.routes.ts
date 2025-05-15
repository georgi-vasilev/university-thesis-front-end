import { Routes } from '@angular/router';
import { EventDetailsComponent } from '../core/event/event-details/event-details.component';
import { EventsComponent } from '../core/event/events/events.component';
import { HostEventsComponent } from '../features/host/events/host-events.component';
import { EventFormComponent } from '../core/event/event-form/event-form.component';

export const routes: Routes = [
  { path: 'events', component: EventsComponent },
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

];
