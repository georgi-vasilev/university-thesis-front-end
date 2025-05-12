import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ standalone: true, name: 'formatDate' })
export class FormatDatePipe implements PipeTransform {
  transform(value: string): string {
    const date = new Date(value);
    return date.toLocaleDateString('en-GB'); // dd/MM/yyyy
  }
}

