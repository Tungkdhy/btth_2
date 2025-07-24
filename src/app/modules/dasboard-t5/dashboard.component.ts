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
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    LeftPanelComponent,
    // LeftPanelComponent,
    // RightPanelComponent,
    // MidPanelComponent,
    TopPanelComponent,
    MidPanelT5Component,
    MangqsComponent,
    RightPanelT5Component,
    MangcdComponent,
    TcmMapComponent
    // AppStateService
    // ModeToggleComponent,
    // DetailPanelComponent,
    // TCMMapComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  selectedNetwork: string = 'internet'; // mặc định nút đầu tiên được chọn
  showMap$ = new Observable<boolean>();
  constructor(private store: Store, public appStateService: AppStateService) {
    this.store.dispatch(loadUnits());
    this.showMap$ = this.appStateService.showMap$;
    console.log('showMap$:', this.appStateService.showMap$);
  }
  selectNetwork(network: string) {
    this.selectedNetwork = network;
    // if(this.selectedNetwork !=='internet') {
    this.appStateService.setShowMap(false);
    // }
  }
}
