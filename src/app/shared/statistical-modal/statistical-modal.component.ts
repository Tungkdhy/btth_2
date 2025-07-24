import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StatisticalModalContentComponent } from './statistical-modal-content/statistical-modal-content.component';

@Component({
  selector: 'app-statistical-modal',
  standalone: true,
  templateUrl: './statistical-modal.component.html',
  styleUrls: ['./statistical-modal.component.scss'],
  imports: [CommonModule, StatisticalModalContentComponent],
})
export class StatisticalModalComponent {
  @Input() unitId: string;

  private modal: NgbActiveModal = inject(NgbActiveModal);

  constructor() {}

  handleClose() {
    setTimeout(() => {
      this.modal.close();
    }, 20);
  }
}
