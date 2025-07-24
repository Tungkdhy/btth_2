import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule, NgForOf, NgIf, NgTemplateOutlet } from '@angular/common';
import { MonitoringSystemModel } from '../../models/monitoring-system.model';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { MonitoringSystemService } from '../../services/monitoring-system.service';
import { MonitoringSystemComponent } from '../../../../pages/system/monitoring-system/monitoring-system.component';
import { DateTimePickerComponent } from '../../../../shared/date-time-picker/date-time-picker.component';
import { ResultListNoPaginationModel } from '../../../../core/models/api-response.model';

@Component({
  selector: 'app-form-monitoring-system',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgTemplateOutlet,
    NgForOf,
    DateTimePickerComponent,
    NgIf,
  ],
  templateUrl: './form-monitoring-system.component.html',
  styleUrls: ['./form-monitoring-system.component.scss'],
})
export class FormMonitoringSystemComponent implements OnInit {
  @Input() selectedId: string;
  @Output() reloadData = new EventEmitter();

  public dataSelected: MonitoringSystemModel;
  public formGroup: FormGroup;
  public isLoading = false;
  public typeMonitoring = ['PRTG', 'FMS'];
  // field: any;

  public modal: NgbActiveModal = inject(NgbActiveModal);
  private formBuilder: FormBuilder = inject(FormBuilder);
  private toast: ToastrService = inject(ToastrService);
  private monitoringService: MonitoringSystemService = inject(
    MonitoringSystemService,
  );
  private _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  constructor() {}

  ngOnInit(): void {
    this.initForm();
    if (this.selectedId) {
      this.monitoringService.getDetail(this.selectedId).subscribe({
        next: (res: ResultListNoPaginationModel) => {
          this.dataSelected = res.data;
          this.formGroup.patchValue({
            uuid: this.dataSelected.uuid,
            name: this.dataSelected.name,
            type: this.dataSelected.type,
            username: this.dataSelected.username,
            password: this.dataSelected.password,
            linkAPI: this.dataSelected.linkAPI,
            orderDate: new Date(this.dataSelected.orderDate),
          });
        },
      });
    }
  }

  public confirm(): void {
    if (this.formGroup.valid) {
      this.isLoading = true;
      setTimeout(() => {
        this.dataSelected ? this.update() : this.add();
        this.back();
      }, 750);
    } else {
      this.toast.warning('Thông tin nhập chưa chính xác!');
      this.formGroup.markAllAsTouched();
    }
  }

  public submitMore(): void {
    if (this.formGroup.valid) {
      this.isLoading = true;
      setTimeout(() => {
        this.add();
        this.reset();
      }, 750);
    } else {
      this.toast.warning('Thông tin nhập chưa chính xác!');
      this.formGroup.markAllAsTouched();
    }
  }

  public reset(): void {
    this.formGroup.reset();
    this.initForm();
  }

  private add(): void {
    this.monitoringService.add(this.formGroup.value).subscribe(() => {
      this.sendReloadData();
      this.isLoading = false;
      this.toast.success('Thêm mới thành công');
    });
  }

  public update(): void {
    this.monitoringService.update(this.formGroup.value).subscribe(() => {
      this.sendReloadData();
      this.isLoading = false;
      this.toast.success('Cập nhật thành công');
    });
  }

  // private getDetail(uuid: string): void {
  //   this.monitoringService.getDetail(uuid).subscribe(
  //     (res: ResultListNoPaginationModel) => {
  //
  //     }
  //   )
  // }

  private initForm(): void {
    this.formGroup = this.formBuilder.group({
      uuid: [this.dataSelected ? this.dataSelected.uuid : ''],
      name: [
        this.dataSelected ? this.dataSelected.name : '',
        Validators.required,
      ],
      type: [
        this.dataSelected ? this.dataSelected.type : '',
        Validators.required,
      ],
      username: [
        this.dataSelected ? this.dataSelected.username : '',
        Validators.required,
      ],
      password: [
        this.dataSelected ? this.dataSelected.password : '',
        Validators.required,
      ],
      linkAPI: [
        this.dataSelected ? this.dataSelected.linkAPI : '',
        Validators.required,
      ],
      orderDate: [
        this.dataSelected ? new Date(this.dataSelected.orderDate) : new Date(),
        Validators.required,
      ],
    });
  }

  public back(): void {
    this.modal.close();
  }

  private sendReloadData(): void {
    this.reloadData.emit();
  }
}
