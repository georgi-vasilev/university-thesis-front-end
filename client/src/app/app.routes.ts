import { Routes } from '@angular/router';
import { EventsComponent } from '../core/event/events/events.component';
import { EventDetailsComponent } from '../core/event/event-details/event-details.component';
import { HostEventsComponent } from '../features/host/events/events.component';

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

];
