import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-confirm-delete-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-delete-modal.component.html',
  styles: [
  ]
})
export class ConfirmDeleteModalComponent {
  @Input() public id: string;
  @Input() public name: string;
  @Input() public data: any;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    if (this.data.name)
      this.name = this.data.name;
    else if (this.data.username)
      this.name = this.data.username;
    else if (this.data.username)
      this.name = this.data.username;
    else if (this.data.referenceSystemName)
      this.name = this.data.referenceSystemName;
    else if (this.data.vlanId)
      this.name = this.data.vlanId;
  }
}
