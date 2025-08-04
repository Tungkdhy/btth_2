import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { LeftPanelComponent } from './components/left-panel/left-panel.component';
// import { RightPanelComponent } from './components/right-panel/right-panel.component';
// import { MidPanelComponent } from './components/mid-panel/mid-panel.component';
// import { TopPanelComponent } from './components/top-panel/top-panel.component';
import { Store } from '@ngrx/store';
import { loadUnits } from '../../store/unit-btth/unit-btth.actions';
// import { ModeToggleComponent } from '../mode-toggle/mode-toggle.component';
// import { DetailPanelComponent } from './components/mid-panel/detail-panel/detail-panel.component';
// import { TCMMapComponent } from "./components/mid-panel/tcm-map/tcm-map.component";
// import { TopPanelComponent } from '../dashboard/components/top-panel/top-panel.component';
import { TopPanelComponent } from './components/top-panel/top-panel.component';
import { LeftPanelComponent } from './components/left-panel/left-panel.component';
import { MidPanelT5Component } from './components/mid-panel/mid-panel.component';
import { RightPanelT5Component } from './components/right-panel/right-panel/right-panel.component';
import { MangqsComponent } from './components/left-panel/components/mangqs/mangqs.component';
import { MangcdComponent } from './components/left-panel/components/mangcd/mangcd.component';
import { AppStateService } from 'src/app/core/services/app-state.service';
import { Observable } from 'rxjs';
import { TcmMapComponent } from './components/left-panel/components/tcm_map/tcm_map.component';
import { TsComponent } from './components/left-panel/components/ts/ts.component';
import { PtmComponent } from './components/left-panel/components/ptm/ptm.component';
import { TcmComponent } from './components/left-panel/components/tcm/tcm.component';
import {
  trigger,
  state,
  style,
  transition,
  animate,
  query,
  group,
} from '@angular/animations';
import { Ts2Component } from './components/left-panel/components/ts_2/ts.component';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    LeftPanelComponent,
    // LeftPanelComponent,
    // RightPanelComponent,
    // MidPanelComponent,
    Ts2Component,
    TopPanelComponent,
    MidPanelT5Component,
    MangqsComponent,
    RightPanelT5Component,
    PtmComponent,
    TcmMapComponent,
    TsComponent,
    MangcdComponent,
    TcmComponent
    // AppStateService
    // ModeToggleComponent,
    // DetailPanelComponent,
    // TCMMapComponent
  ],
  animations: [
    trigger('slideFade', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-960px)' }),
        animate('800ms ease-out', style({ opacity: 1, transform: 'translateY(0px)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 1, transform: 'translateY(0px)' }))
      ])
    ]),
    trigger('slideLeftFade', [
      transition(':enter', [
        style({ opacity: 1, transform: 'translateY(650px)' }),
        animate('800ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      
    ]),
     trigger('slideLeftFadeTCM', [
      transition(':enter', [
        style({ opacity: 1, transform: 'translateY(1015px)' }),
        animate('800ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      
    ])
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  selectedNetwork: string = 'internet';
  isHideTCM: boolean = true; // mặc định nút đầu tiên được chọn
  showMap$ = new Observable<boolean>();
  constructor(private store: Store, public appStateService: AppStateService) {
    this.store.dispatch(loadUnits());
    this.showMap$ = this.appStateService.showMap$;
    console.log('showMap$:', this.appStateService.showMap$);
  }
  hideTCM() {
    this.isHideTCM = !this.isHideTCM;
    // this.appStateService.setShowMap(this.isHideTCM);
  }
  selectNetwork(network: string) {
    this.selectedNetwork = network;
    // if(this.selectedNetwork !=='internet') {
    this.appStateService.setShowMap(false);
    // }
  }
  toggleMap() {
    this.appStateService.toggleShowMap(); // dùng được ngoài constructor
  }
}
