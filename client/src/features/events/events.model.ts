import { TimeRange } from "./time-range.model";

export interface GetEventsOutputModel {
  id: string;
  name: string;
  description: string;
  date: string;
  time: TimeRange;
  status: string;
  posterUrl: string | null;
}

