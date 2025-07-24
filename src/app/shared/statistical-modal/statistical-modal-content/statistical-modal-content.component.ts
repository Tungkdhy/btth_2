import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FmsAlertCardComponent } from '../fms-alert-card/fms-alert-card.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PrtgAlertWidgetComponent } from '../prtg-alert-widget/prtg-alert-widget.component';

@Component({
  selector: 'app-statistical-modal-content',
  standalone: true,
  imports: [CommonModule, PrtgAlertWidgetComponent, FmsAlertCardComponent],
  templateUrl: './statistical-modal-content.component.html',
  styleUrls: ['./statistical-modal-content.component.scss'],
})
export class StatisticalModalContentComponent {
  @Input() unitId: string;

  private modal: NgbActiveModal = inject(NgbActiveModal);

  close() {
    setTimeout(() => {
      this.modal.close();
    }, 20);
  }
}
