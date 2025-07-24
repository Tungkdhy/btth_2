import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  inject,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  DdtChangeEventArgs,
  DdtSelectEventArgs,
  DropDownTreeComponent,
  DropDownTreeModule,
  FieldsModel,
} from '@syncfusion/ej2-angular-dropdowns';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-dropdown-tree',
  standalone: true,
  imports: [DropDownTreeModule],
  templateUrl: './dropdown-tree.component.html',
  styleUrls: ['./dropdown-tree.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownTreeComponent),
      multi: true,
    },
  ],
})
export class DropdownTreeComponent
  implements OnInit, ControlValueAccessor, AfterViewInit
{
  @ViewChild('dropDownTree') dropDownTree: DropDownTreeComponent;

  private _fields: FieldsModel = {
    dataSource: [],
    value: 'id',
    text: 'name',
    child: 'children',
    hasChildren: 'hasChildren',
  };
  @Input() set fields(value: FieldsModel) {
    this._fields = value;
    if (value) {
      this.onSelectValue(this.selectedValue);
    }
  }
  get fields(): FieldsModel {
    return this._fields;
  }

  @Input() placeholder: string = '';

  @Input() itemTemplate: string;

  @Input() allowFiltering: boolean = true;
  @Input() readonly: boolean = false;
  @Input() showCheckBox: boolean = false;
  filterPlaceholder: string = 'Tìm kiếm';

  @Output() selectNode = new EventEmitter();

  selectedValue: string = '';

  onChange: any = (data: string) => {};
  onTouched: any = () => {};

  isDisabled: boolean = false;

  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  handleSelect(event: DdtSelectEventArgs): void {
    this.onTouched();
    this.onChange(event.itemData.id);
    this.selectNode.emit(event.itemData.id);
  }

  clearValue(event: DdtChangeEventArgs): void {
    if (event && !event.value[0]) {
      this.onTouched();
      this.onChange(null);
      this.selectNode.emit(null);
    }
  }

  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }

  writeValue(selectedValue: string) {
    this.selectedValue = selectedValue;
  }

  setDisabledState(isDisabled: boolean) {
    this.isDisabled = isDisabled;
  }

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.selectedValue) this.onSelectValue(this.selectedValue);
    }, 200);
  }

  onSelectValue(value: string) {
    if (this.dropDownTree && value) {
      if (
        this.fields.dataSource &&
        (this.fields.dataSource as []).some((item: any) => item.id === value)
      ) {
        setTimeout(() => {
          this.dropDownTree.value = [value];
          this.cdr.markForCheck();
        }, 200);
      }
    }
  }
}
