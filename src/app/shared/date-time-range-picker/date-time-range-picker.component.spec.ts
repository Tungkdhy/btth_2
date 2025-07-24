import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateTimeRangePickerComponent } from './date-time-range-picker.component';
import { CommonModule } from '@angular/common';
import { DateRangePickerModule, RangeEventArgs } from '@syncfusion/ej2-angular-calendars';

describe('DateTimeRangePickerComponent', () => {
  let component: DateTimeRangePickerComponent;
  let fixture: ComponentFixture<DateTimeRangePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DateTimeRangePickerComponent],
      imports: [CommonModule, DateRangePickerModule],
    }).compileComponents();

    fixture = TestBed.createComponent(DateTimeRangePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

it('should emit selectDate event when date range is selected', () => {
  const startDate = new Date('2021-01-01');
  const endDate = new Date('2021-01-31');
  const eventArgs: RangeEventArgs = {
    startDate,
    endDate,
    value: [startDate, endDate],
  };
  spyOn(component.selectDate, 'emit');

  component.onSelectDate(eventArgs);

  expect(component.selectDate.emit).toHaveBeenCalledWith({
    startDate,
    endDate,
  });
});
});
