import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { StandaloneMapService } from './service/standalone-map.service';
import { Constant } from '../../core/config/constant';

@Component({
  selector: 'app-standalone-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './standalone-map.component.html',
  styles: ['.map {height: 100%; width: 100%;}'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StandaloneMapComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @Input() zoomLevel: number = Constant.DEFAULT.MAP.VIEW.ZOOM_LEVEL;
  @Input() latitude: number = Constant.DEFAULT.MAP.VIEW.LATITUDE;
  @Input() longitude: number = Constant.DEFAULT.MAP.VIEW.LONGITUDE;

  @ViewChild('mapElement') mapElement: ElementRef;
  constructor(private standaloneMapService: StandaloneMapService) {}
  ngOnInit() {}

  ngAfterViewInit(): void {
    this.standaloneMapService.initialMap(
      this.mapElement.nativeElement.id,
      this.latitude,
      this.longitude,
      this.zoomLevel,
    );
  }

  ngOnDestroy() {
    if (this.standaloneMapService.map) {
      this.standaloneMapService.destroyMap();
    }
  }
}
