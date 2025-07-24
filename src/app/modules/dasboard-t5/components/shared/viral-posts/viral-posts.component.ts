import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export interface ViralPost {
  title: string;
  date: string;
  time: string;
  likes: string;        // ví dụ: '69K'
  comments: string;     // ví dụ: '1.8K'
  shares: string;       // ví dụ: '1.6K'
}

@Component({
  selector: 'app-viral-posts',
  templateUrl: './viral-posts.component.html',
  styleUrls: ['./viral-posts.component.scss'],
  standalone:true,
  imports: [CommonModule],
})
export class ViralPostsComponent {
  @Input() posts: ViralPost[] = [];
}
