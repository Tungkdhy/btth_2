import {Component, EventEmitter, forwardRef, Input, OnInit, Output} from '@angular/core';
import {ControlValueAccessor, FormGroup, NG_VALUE_ACCESSOR} from "@angular/forms";
import {DateRangePickerModule} from "@syncfusion/ej2-angular-calendars";

@Component({
  selector: 'app-date-range-picker',
  standalone: true,
  imports: [
    DateRangePickerModule
  ],
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateRangePickerComponent),
      multi: true
    }
  ]
})
export class DateRangePickerComponent implements OnInit, ControlValueAccessor {
  @Input()
  label: string;

  @Input()
  isRequired: string;

  @Input()
  parentForm: FormGroup;

  @Input()
  formControlName: string;

  @Output()
  handleSelectDate: EventEmitter<any> = new EventEmitter<any>();

  value: string;

  onChange = (value: any) => {};

  onTouched = () => {};

  isDisabled: boolean = false;

  constructor() { }

  ngOnInit(): void {}

  onSelectDate(event: any) {
    this.onTouched();
    this.value = event.value;
    this.onChange(this.value);
    this.handleSelectDate.emit(this.value);
  }

  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }

  writeValue(value: any) {
    this.value = value;
  }

  setDisabledState(isDisabled: boolean) {
    this.isDisabled = isDisabled;
  }
}
