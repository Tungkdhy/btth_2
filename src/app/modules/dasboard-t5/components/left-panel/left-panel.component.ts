import { Component } from '@angular/core';
import {TcmComponent} from './components/tcm/tcm.component'
import { CommonModule } from '@angular/common';
import { TsComponent } from "./components/ts/ts.component";
import { PtmComponent } from './components/ptm/ptm.component';
@Component({
  selector: 'app-left-panel',
  imports: [
    CommonModule,
    TcmComponent,
    TsComponent,
    PtmComponent
],
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.scss'],
  standalone: true,

})
export class LeftPanelComponent {

}
