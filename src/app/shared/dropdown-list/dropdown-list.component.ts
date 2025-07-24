import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  DropDownListModule,
  FilteringEventArgs,
} from '@syncfusion/ej2-angular-dropdowns';
import { Predicate, Query } from '@syncfusion/ej2-data';
import { NgIf } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-dropdown-list',
  templateUrl: './dropdown-list.component.html',
  styles: [],
  imports: [DropDownListModule, NgIf],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownListComponent),
      multi: true,
    },
  ],
})
export class DropdownListComponent implements OnInit, ControlValueAccessor {
  private _dataSource: any = [];
  get dataSource(): any {
    return this._dataSource;
  }

  @Input() set dataSource(value: any) {
    this._dataSource = value;
  }

  @Input() fields: any;
  @Input() placeholder: string;
  @Input() popupHeight: string;
  @Input() readonly: boolean = false;
  @Input() searchOnField: string = 'name';

  @Output() selectNode = new EventEmitter();

  public filteredData: any[] = [];

  public allowFiltering: boolean = true;

  constructor() {}

  ngOnInit(): void {}

  public value: string;

  onChange: any = (value: string) => {};

  onTouched: any = () => {};

  isDisabled: boolean = false;

  changeValue(event: any): void {
    this.onTouched();
    this.value = event.value;
    this.onChange(this.value);
    this.selectNode.emit(this.value);
  }

  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }

  writeValue(value: string) {
    this.value = value;
  }

  setDisabledState(isDisabled: boolean) {
    this.isDisabled = isDisabled;
  }

  // Default search on field name, and with another field
  public onFiltering: any = (e: FilteringEventArgs) => {
    const data = JSON.parse(JSON.stringify(this.dataSource));
    let query = new Query();
    query =
      e.text != ''
        ? query.where(
            new Predicate('name', 'contains', e.text, true).or(
              this.searchOnField,
              'contains',
              e.text,
              true,
            ),
          )
        : query;
    e.updateData(data, query as any);
  };
}
