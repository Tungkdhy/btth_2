import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Map as olMap, Overlay } from 'ol';
import { Observable } from 'rxjs';
import { InformationWarfareStatsComponent } from '../information-warfare-stats/information-warfare-stats.component';
import { InformationWarfareMapService } from '../../../services/information-warfare-map.service';
import { LegendOnMapComponent } from '../legend-on-map/legend-on-map.component';
import {
  HotSpotInfo,
  HotSpotStatistics,
  IwLayerIds,
  NuanceStats,
} from '../../../models/btth.interface';
import { generateTooltipContent } from '../../../utils/map-utils';
import { IwNuanceTableComponent } from '../information-warfare-panels/iw-nuance-table/iw-nuance-table.component';
import { IwHotspotTableComponent } from '../information-warfare-panels/iw-hotspot-table/iw-hotspot-table.component';
import {
  LayersSwitcherComponent,
  LayerSwitcher,
} from '../../shared/layers-switcher/layers-switcher.component';
import { MultiPolygon } from 'ol/geom';

@Component({
  selector: 'app-information-warfare-map',
  standalone: true,
  imports: [
    CommonModule,
    InformationWarfareStatsComponent,
    LegendOnMapComponent,
    IwNuanceTableComponent,
    IwHotspotTableComponent,
    LayersSwitcherComponent,
  ],
  templateUrl: './information-warfare-map.component.html',
  styleUrls: ['./information-warfare-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InformationWarfareMapComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @Input() mapId: string = 'iw-map';

  private map: olMap;
  tooltipElement: HTMLElement;
  tooltipOverlay: Overlay;
  mapLayers: LayerSwitcher[] = [];

  isShowPanel: boolean = false;
  nuanceMap$: Observable<NuanceStats[]>;
  hotSpotInfoMap$: Observable<HotSpotInfo[]>;
  hotSpotStatsMap$: Observable<HotSpotStatistics[]>;

  private readonly NUANCE_PROPERTY_LABELS: { [key: string]: string } = {
    name: 'Đơn vị',
    totalCount: 'Tổng số tin',
    positiveCount: 'Tin tích cực',
    neutralCount: 'Tin trung tính',
    // negativeCount: 'Tin tiêu cực',
    negativeCount: 'Cần xác minh',
  };

  private readonly HOTSPOT_INFO_PROPERTY_LABELS: { [key: string]: string } = {
    name: 'Tên',
    address: 'Địa chỉ',
    unit: 'Đơn vị',
  };

  private readonly HOTSPOT_STATS_PROPERTY_LABELS: { [key: string]: string } = {
    name: 'Đơn vị',
    totalBots: 'BOT',
    totalIndustrialParks: 'Khu công nghiệp',
    totalParishes: 'Giáo xứ',
  };

  constructor(private mapService: InformationWarfareMapService) {}

  ngOnInit() {
    this.mapService.initializeMap();
    this.nuanceMap$ = this.mapService.renderNuanceStats();
    this.hotSpotInfoMap$ = this.mapService.renderHotSpotInfo();
    this.hotSpotStatsMap$ = this.mapService.renderHotSpotStats();
  }

  ngAfterViewInit(): void {
    this.map = this.mapService.getMapInstance();
    this.map.setTarget(this.mapId);
    this.tooltipElement = this.mapService.createTooltipOverlay();
    this.mapLayers = [
      {
        name: 'Chỉ số sắc thái',
        iconUrl: 'assets/media/svg/map/nuance.png',
        layer: this.mapService.getNuanceLayer(),
      },
      {
        name: 'Tổng quan điểm nóng',
        iconUrl: 'assets/media/svg/map/overview-hotspot.png',
        layer: this.mapService.getHotSpotStatsLayer(),
      },
      {
        name: 'Chi tiết điểm nóng',
        iconUrl: 'assets/media/svg/map/detail-hotspot.png',
        layer: this.mapService.getHotSpotInfoLayer(),
      },
    ];

    this.setupHoverInteraction();
    this.setupHoverInteractionForMultiPolygon();
  }

  setupHoverInteraction(): void {
    const hoverInteraction = this.mapService.createHoverInteraction(
      this.mapService.getHotSpotLayers(),
      this.updateTooltip.bind(this),
    );
    this.map.addInteraction(hoverInteraction);
  }

  setupHoverInteractionForMultiPolygon(): void {
    const hoverInteraction =
      this.mapService.createHoverInteractionForMultiPolygon(
        this.mapService.getNuanceLayers(),
        this.updateTooltipForMultiPolygon.bind(this),
      );
    this.map.addInteraction(hoverInteraction);
  }

  updateTooltip(event: any): void {
    if (event.selected.length > 0) {
      const feature = event.selected[0];
      const layerId = feature.get('layerId');
      let content = '';
      switch (layerId) {
        case IwLayerIds.HOTSPOT_INFO:
          content = generateTooltipContent(
            feature,
            this.HOTSPOT_INFO_PROPERTY_LABELS,
          );
          break;
        case IwLayerIds.HOTSPOT_STATS:
          content = generateTooltipContent(
            feature,
            this.HOTSPOT_STATS_PROPERTY_LABELS,
          );
          break;
        default:
          content = '';
          break;
      }

      this.mapService.showTooltip(this.tooltipOverlay, feature, content);
    } else {
      this.tooltipElement.style.display = 'none';
    }
  }

  updateTooltipForMultiPolygon(event: any): void {
    if (event.selected.length > 0) {
      const feature = event.selected[0];
      const layerId = feature.get('layerId');
      let content = '';
      switch (layerId) {
        case IwLayerIds.NUANCE:
          content = generateTooltipContent(
            feature,
            this.NUANCE_PROPERTY_LABELS,
          );
          break;
        default:
          content = '';
          break;
      }

      this.mapService.showTooltipForMultiPolygon(
        this.tooltipOverlay,
        feature,
        content,
      );
    } else {
      this.tooltipElement.style.display = 'none';
    }
  }

  ngOnDestroy(): void {
    this.mapService.destroyMap();
  }
}
