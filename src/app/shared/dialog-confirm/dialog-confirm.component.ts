import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  standalone: true,
  selector: 'app-dialog-confirm',
  templateUrl: './dialog-confirm.component.html',
  styleUrls: ['./dialog-confirm.component.scss']
})
export class DialogConfirmComponent implements OnInit {
  @Input() title = '';
  @Input() keyword = '';
  @Input() description = '';

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  public confirm(): void {
    if (this.activeModal)
      this.activeModal.close();
  }

  public dismiss(): void {
    if (this.activeModal)
      this.activeModal.dismiss();
  }

}
