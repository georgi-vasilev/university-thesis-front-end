import { EventDetailsOutputModel } from '../events/event-details.model';

export interface HostDetails {
  fullName: string;
  email: string;
  instagramHandler: string;
  organizedEvents: EventDetailsOutputModel[];
}
