import {Component, EventEmitter, forwardRef, Input, OnInit, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {DateTimePickerModule} from "@syncfusion/ej2-angular-calendars";

@Component({
  selector: 'app-date-time-picker',
  standalone: true,
  imports: [DateTimePickerModule],
  templateUrl: './date-time-picker.component.html',
  styles: [
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateTimePickerComponent),
      multi: true,
    },
  ],
})
export class DateTimePickerComponent
  implements OnInit, ControlValueAccessor
{
  private _value: Date;
  public get value(): Date {
    return this._value;
  }

  @Input() set value(date: Date) {
    this._value = date;
  }

  @Input() readonly: boolean = false;
  @Input() minDate: Date;
  @Input() maxDate: Date;
  @Input() placeholder: string;

  @Output() handleSelectDate: EventEmitter<any> = new EventEmitter<any>();
  onChange = (value: Date) => {};

  onTouched = () => {};

  isDisabled: boolean = false;

  constructor() {}

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

  writeValue(value: Date) {
    this.value = value;
  }

  setDisabledState(isDisabled: boolean) {
    this.isDisabled = isDisabled;
  }
}
