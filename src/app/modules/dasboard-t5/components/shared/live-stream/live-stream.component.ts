import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export interface LivestreamItem {
  name: string;
  datetime: string;
  time: string;
  views: number;
  interactions: number;
  avatarUrl?: string;
}

@Component({
  selector: 'app-live-stream',
  templateUrl: './live-stream.component.html',
  styleUrls: ['./live-stream.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class LivestreamWarningComponent {
  @Input() data: LivestreamItem[] = [];
}