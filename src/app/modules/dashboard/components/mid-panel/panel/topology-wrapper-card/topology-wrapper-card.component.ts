import {
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LayerIds,
  MainType,
  FeatureDisplayData,
  TopologyData,
} from '../../../../models/btth.interface';
import { Observable, tap } from 'rxjs';
import { MapSupabaseService } from '../../../../services/map-supabase.service';
import { TopologyCardComponent } from '../../../shared/topology-card/topology-card.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TitlePanelComponent } from '../title-panel/title-panel.component';
import { NeunLoadingComponent } from '../../../../../../shared/neun-loading/neun-loading.component';

@Component({
  selector: 'app-topology-wrapper-card',
  standalone: true,
  imports: [
    CommonModule,
    TopologyCardComponent,
    ReactiveFormsModule,
    FormsModule,
    TitlePanelComponent,
    NeunLoadingComponent,
  ],
  templateUrl: './topology-wrapper-card.component.html',
  styleUrls: ['./topology-wrapper-card.component.scss'],
})
export class TopologyWrapperCardComponent implements OnChanges, OnInit {
  @Input() selectedFeature?: FeatureDisplayData;
  protected readonly LayerIds = LayerIds;

  networkItems = [
    {
      name: 'Quân sự',
      value: MainType.MILITARY,
    },
    {
      name: 'Internet',
      value: MainType.INTERNET,
    },
    // {
    //   name: 'Chuyên dùng',
    //   value: MainType.CD,
    // },
  ];

  selectedNetwork: MainType = MainType.MILITARY; // Default selection

  topology$: Observable<TopologyData | null>;

  private mapSupabase = inject(MapSupabaseService);
  private modalService = inject(NgbModal);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    const data = changes['selectedFeature'].currentValue;
    if (!data) return;
    if (this.selectedFeature?.unitPath) {
      this.topology$ = this.getTopologyData(this.selectedFeature?.unitPath);
    }
  }

  getTopologyData(
    unitPath: string,
    mainType: MainType = MainType.MILITARY,
  ): Observable<TopologyData | null> {
    return this.mapSupabase.getTopologyData(unitPath, mainType);
  }
  isModalOpen = false;
  dismissedModal$: Observable<void>;
  openModal(content: any) {
    const modalRef = this.modalService.open(content, {
      ariaLabelledBy: 'modal-topology',
      windowClass: 'modal-topology',
      centered: true,
    });
    this.isModalOpen = true;
    this.cdr.markForCheck();
    this.dismissedModal$ = modalRef.dismissed.pipe(
      tap(() => {
        this.isModalOpen = false;
      }),
    );
  }

  onNetworkChange(networkType: MainType): void {
    if (this.selectedFeature?.unitPath) {
      this.topology$ = this.getTopologyData(
        this.selectedFeature?.unitPath,
        networkType,
      );
    }
  }

  isTopologyHasNodes(topology: TopologyData | null): boolean {
    if (!topology) return false;
    return topology.nodes && topology.nodes.length > 0;
  }
}
