import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormUnitComponent } from '../../../../modules/unit/components/form-unit/form-unit.component';
import { ITypeUnit } from '../../../../modules/unit/models/unit.model';

@Component({
  selector: 'app-main-form-unit',
  standalone: true,
  imports: [FormUnitComponent],
  templateUrl: './main-form-unit.component.html',
  styles: [],
})
export class MainFormUnitComponent {
  @Input() type: ITypeUnit = 'UNIT';
  @Input() belong: string;

  constructor(public modal: NgbActiveModal) {}
}
