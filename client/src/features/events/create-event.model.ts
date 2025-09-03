export interface CreateEventModel {
  name: string;
  description: string;
  imageUrl: string;
  date: string;
  startTime: string;
  endTime: string;
  venueId: string;
  capacity: number;
  generalTicketPrice: number;
  vipTicketPrice: number | null;
}
