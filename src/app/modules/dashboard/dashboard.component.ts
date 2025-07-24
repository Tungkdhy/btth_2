// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { LeftPanelComponent } from './components/left-panel/left-panel.component';
// import { RightPanelComponent } from './components/right-panel/right-panel.component';
// import { MidPanelComponent } from './components/mid-panel/mid-panel.component';
// import { TopPanelComponent } from './components/top-panel/top-panel.component';
// import { Store } from '@ngrx/store';
// import { loadUnits } from '../../store/unit-btth/unit-btth.actions';
// import { ModeToggleComponent } from '../mode-toggle/mode-toggle.component';
// import { DetailPanelComponent } from './components/mid-panel/detail-panel/detail-panel.component';
// import { TCMMapComponent } from "./components/mid-panel/tcm-map/tcm-map.component";


// @Component({
//   selector: 'app-dashboard',
//   standalone: true,
//   imports: [
//     CommonModule,
//     LeftPanelComponent,
//     RightPanelComponent,
//     MidPanelComponent,
//     TopPanelComponent,
//     ModeToggleComponent,
//     DetailPanelComponent,
//     TCMMapComponent
//   ],
//   templateUrl: './dashboard.component.html',
//   styleUrls: ['./dashboard.component.scss'],
// })
// export class DashboardComponent {
//   constructor(private store: Store) {
//     this.store.dispatch(loadUnits());
//   }
// }
