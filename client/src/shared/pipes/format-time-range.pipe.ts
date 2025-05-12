import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ standalone: true, name: 'formatTimeRange' })
export class FormatTimeRangePipe implements PipeTransform {
  transform(time: { start: string; end: string }): string {
    const format = (datetime: string) => {
      const date = new Date(datetime);
      return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    };

    return `${format(time.start)} - ${format(time.end)}`;
  }
}

