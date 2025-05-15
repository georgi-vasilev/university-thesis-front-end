export interface UpdateEventCommandModel {
  eventId: string;
  name: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  venueId: string;
}


export interface UpdateCommandOutputModel {
  name: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  venueName: string;
}

