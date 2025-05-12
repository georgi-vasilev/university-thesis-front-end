import { TimeRange } from "./time-range.model";

export interface EventDetailsOutputModel {
  id: string;
  name: string;
  description: string;
  venue: string;
  hostInstagramHandler: string;
  date: string;
  time: TimeRange;
  status: string;
  availableTickets: number;
}

