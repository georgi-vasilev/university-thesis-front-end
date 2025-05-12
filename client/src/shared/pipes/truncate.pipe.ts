import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ standalone: true, name: 'truncate' })
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 50): string {
    return value.length > limit ? value.slice(0, limit) + '...' : value;
  }
}

