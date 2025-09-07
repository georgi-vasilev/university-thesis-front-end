import { Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HostService } from '../host.service';
import { HostDetails } from '../host.details.model';
import { CommonModule } from '@angular/common';
import { FormatDatePipe } from '../../../shared/pipes/formate-date.pipe';
import { FormatTimeRangePipe } from '../../../shared/pipes/format-time-range.pipe';

@Component({
  selector: 'app-host-details',
  imports: [
    CommonModule,
    FormatDatePipe,
    FormatTimeRangePipe,
    RouterModule],
  templateUrl: './host-details.component.html',
  styleUrl: './host-details.component.scss'
})
export class HostDetailsComponent {
  private route = inject(ActivatedRoute);
  private hostService = inject(HostService);

  hostId = signal(this.route.snapshot.paramMap.get('id')!);
  hostInfo = signal<HostDetails | null>(null);

  constructor() {
    effect(() => {
      const id = this.hostId();
      this.hostService.getHostDetailsById(id).subscribe(data => {
        this.hostInfo.set(data);
      });
    });
  }
}
