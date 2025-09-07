import { TimeRange } from "./time-range.model";

export interface EventDetailsOutputModel {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  venue: string;
  hostId: string;
  hostInstagramHandler: string;
  date: string;
  time: TimeRange;
  generalPrice: number;
  vipPrice: number | null;
  status: string;
  availableTickets: number;
}

