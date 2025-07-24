import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { IData, StateService } from '../../../services/state.service';

@Component({
  selector: 'app-information-target',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './information-target.component.html',
  styleUrls: ['./information-target.component.scss'],
})
export class InformationTargetComponent implements OnInit {
  @Input() detail: any;
  data: any | null;
  @Output() goBack: EventEmitter<any> = new EventEmitter();
  subscription: Subscription;

  constructor(private stateService: StateService) {}
  ngOnInit() {
    this.subscription = this.stateService.detailTarget$.subscribe(
      (value: IData | null) => {
        if (value?.type === 'information_target') {
          console.log('value: ', value);
          this.data = value;
        } else {
          this.data = null;
        }
      },
    );
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
