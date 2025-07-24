import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IData, StateService } from '../../../services/state.service';
import { Subscription } from 'rxjs';
import { ParentNode } from '../tcm-map/tcm-map.component';
import { fromLonLat } from 'ol/proj';
import { AdministrativeMapService } from '../../../services/administrative-map.service';
import { Constant } from 'src/app/core/config/constant';

import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Style, Icon, Stroke, Circle as CircleStyle, Fill } from 'ol/style';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';

import {easeOut} from 'ol/easing';
import {getVectorContext} from 'ol/render';
import {unByKey} from 'ol/Observable';

@Component({
  selector: 'app-target-detail-legend-on-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './target-detail-legend-on-map.component.html',
  styleUrls: ['./target-detail-legend-on-map.component.scss'],
})
export class TargetDetailLegendOnMapComponent implements OnInit {
  @Input() legendData: any[];
  data: IData | null;
  subscription: Subscription;
  acceptIcon: string;
  rejectIcon: string;
  subscriptionActiveRow: Subscription;
  selectedRow: string | null;
  highlightedFeature: any;
  highlightLayer: any;
  private flashListenerKey: any;  
  private flashListenerKeys: any; 

  constructor(
    private stateService: StateService,
    private mapService: AdministrativeMapService,
  ) {
    this.acceptIcon = Constant.DEFAULT.TCM.ACCEPT;
    this.rejectIcon = Constant.DEFAULT.TCM.REJECT;
  }
  @Output() goBack: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
    this.subscription = this.stateService.viewDetail$.subscribe(
      (value: IData | null) => {
        if (value?.type === 'muctieu') {
          this.data = value;
          this.legendData.forEach((node) => {
            node.expand = false;
          });
        } else {
          this.data = null;
        }
      },
    );
    this.subscriptionActiveRow = this.stateService.activeChildRow$.subscribe(
      (key: string | null) => {
        this.selectedRow = key;
      },
    );
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getNumerator(count: string): string {
    return count.split('/')[0];
  }

  getDenominator(count: string): string {
    return count.split('/')[1];
  }

  isGreenText(count: string): boolean {
    // Modify this logic if you have specific conditions for applying green text
    const numerator = parseInt(this.getNumerator(count), 10);
    // return numerator > 100; // Example condition: apply green text if the numerator is greater than 100
    return true;
  }
  toggleExpand(item: ParentNode): void {
    this.legendData.forEach((node) => {
      if (node !== item) {
        node.expand = false;
      }
    });
    item.expand = !item.expand;
  }
  onRowClick(item: any): void {
    this.stateService.onShowDetailTarget(null);
    // Xóa feature và hiệu ứng nhấp nháy highlight hiện tại nếu có
    this.clearPreviousHighlight();
  }
  onChildRowClick(item: any): void {
    this.stateService.onShowDetailTarget({
      ...item,
      type: 'information_target',
    });
    const lat = item.lat.trim();
    const lon = item.lon.trim();

    const coordinates = fromLonLat([lat, lon]);

    // Xóa feature hiện tại nếu có
    this.clearPreviousHighlight();

    // Tạo một feature mới tại tọa độ này
    this.highlightedFeature = new Feature({
      geometry: new Point(coordinates),
    });
    // Tạo style để làm nổi bật feature
    // const highlightStyle = new Style({
    //   image: new Icon({
    //       src: item.cyber_code == 'TT186' ? Constant.DEFAULT.TCM.TT1
    //         : item.cyber_code == 'TT286' ? Constant.DEFAULT.TCM.TT2
    //         : item.cyber_code == 'TT386' ? Constant.DEFAULT.TCM.TT3
    //         : Constant.DEFAULT.TCM.TT5,
    //       scale: 1.0, // Tùy chỉnh kích thước icon
    //   }),
    // });
    const highlightStyle = new Style({
      image: new Icon({
        src: Constant.DEFAULT.TCM.RIPPLE,
        scale: 5, // Tùy chỉnh kích thước icon
      }),
    });

    // Áp dụng style cho feature
    this.highlightedFeature.setStyle(highlightStyle);
    // Thêm feature vào một Vector Layer
    const vectorSource = new VectorSource({
      features: [this.highlightedFeature],
    });
    this.highlightLayer = new VectorLayer({
      source: vectorSource,
    });

    const map = this.mapService.map;
    const view = map.getView();

    view.animate({
      center: coordinates,
      zoom: 8,
      duration: 1000,
    });

    // Đảm bảo rằng thao tác thêm layer không làm ảnh hưởng đến animate
    if (!map.getLayers().getArray().includes(this.highlightLayer)) {
      map.addLayer(this.highlightLayer);
    }
    // Bắt đầu hiệu ứng nhấp nháy
    this.flash(this.highlightedFeature);
  }
  flash(feature: Feature) {
    const duration = 1000;
    const maxRadius = 50; // Bán kính tối đa của vòng tròn nhấp nháy
    const flashGeom = feature.getGeometry()?.clone();
    if (!flashGeom) return;
  
    const repeatFlash = (delay: number) => {
      // Xóa sự kiện postrender cũ nếu có
      if (this.flashListenerKeys.length > 0) {
        unByKey(this.flashListenerKeys.pop());
      }
      var start = Date.now() + delay;
      const flashListenerKey = this.highlightLayer!.on('postrender', (event: any) => {
        const frameState = event.frameState;
        const elapsed = frameState.time - start;

        if (elapsed >= duration) {
          //unByKey(flashListenerKey);
          //repeatFlash(delay); // Gọi lại chính nó để tạo hiệu ứng lặp lại
          start = frameState.time;
          return;
        }

        const elapsedRatio = elapsed / duration;
        const radius = easeOut(elapsedRatio) * maxRadius + 5;
        const opacity = easeOut(1 - elapsedRatio);
  
        const style = new Style({
          image: new CircleStyle({
            radius: radius,
            stroke: new Stroke({
              color: `rgba(255, 0, 0, ${opacity})`,
              width: 2 + opacity,
            }),
          }),
        });
  
        const vectorContext = getVectorContext(event);
        vectorContext.setStyle(style);
        vectorContext.drawGeometry(flashGeom);
        this.mapService.map.render();
      });
      // Lưu trữ listenerKey vào mảng để quản lý
      this.flashListenerKeys.push(flashListenerKey);
    };  

    // Khởi tạo mảng flashListenerKeys nếu chưa có
    if (!this.flashListenerKeys) {
      this.flashListenerKeys = [];
    }
    // Vòng tròn nhấp nháy đầu tiên
    repeatFlash(0);
    // Vòng tròn nhấp nháy thứ hai, diễn ra muộn hơn 2 giây
    //repeatFlash(1000);    
  }

  clearPreviousHighlight() {
    // Hủy bỏ tất cả các sự kiện postrender đã lưu trữ
    if (this.flashListenerKeys && this.flashListenerKeys.length > 0) {
      //this.flashListenerKeys.forEach((key) => unByKey(key));
      unByKey(this.flashListenerKeys);
      this.flashListenerKeys = [];
    }
  
    // Xóa feature hiện tại nếu có
    if (this.highlightedFeature) {
      this.highlightLayer?.getSource()?.removeFeature(this.highlightedFeature);
      this.highlightedFeature = null;
    }
  
    // Xóa highlightLayer khỏi bản đồ nếu nó tồn tại
    if (this.highlightLayer) {
      this.mapService.map.removeLayer(this.highlightLayer);
      this.highlightLayer = null;
    }
  }
}
