import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DateRangePickerModule,
  RangeEventArgs,
} from '@syncfusion/ej2-angular-calendars';
import { Constant } from 'src/app/core/config/constant';
import {
  generateStartEndDates,
  getEndOfDay,
  getStartOfDay,
} from '../../_metronic/layout/core/common/common-utils';
import { Store } from '@ngrx/store';
import { selectDateV2 } from 'src/app/store/date-time-range-v2/date-time-range-v2.selectors';
import { Observable, tap } from 'rxjs';
import { isEqual } from 'lodash-es';
import { Period } from '../../modules/dashboard/models/btth.interface';

interface SelectedDateRange {
  startDate: Date;
  endDate: Date;
}

@Component({
  selector: 'app-date-time-range-picker',
  standalone: true,
  imports: [CommonModule, DateRangePickerModule],
  templateUrl: './date-time-range-picker.component.html',
  styles: [
    `
      :host {
        width: 100%;
      }
    `,
  ],
})
export class DateTimeRangePickerComponent implements OnInit {
  @Input() startDate: Date;
  @Input() endDate: Date;
  @Input() placeholder: string = 'Ngày bắt đầu - Ngày kết thúc';
  @Output() selectDate: EventEmitter<SelectedDateRange> =
    new EventEmitter<SelectedDateRange>();

  private initialSelection = true;
  zIndex = Constant.MAX_Z_INDEX;
  public readonly today = generateStartEndDates(Period.TODAY);
  public readonly thisWeek = generateStartEndDates(Period.THIS_WEEK);
  public readonly lastWeek = generateStartEndDates(Period.LAST_WEEK);
  public readonly thisMonth = generateStartEndDates(Period.THIS_MONTH);
  public readonly lastMonth = generateStartEndDates(Period.LAST_MONTH);
  public readonly thisYear = generateStartEndDates(Period.THIS_YEAR);
  public readonly lastYear = generateStartEndDates(Period.LAST_YEAR);

  date$: Observable<any>;

  private store = inject(Store);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.date$ = this.store.select(selectDateV2).pipe(
      tap((date) => {
        if (date.startDate && date.endDate) {
          this.startDate = date.startDate;
          this.endDate = date.endDate;
        }
      }),
    );
  }

  onSelectDate(event: RangeEventArgs) {
    const selectedRange = {
      startDate: event.startDate,
      endDate: event.endDate,
    };

    if (
      !this.initialSelection &&
      (!isEqual(selectedRange.startDate, this.startDate) ||
        !isEqual(selectedRange.endDate, this.endDate))
    ) {
      if (selectedRange.startDate && selectedRange.endDate) {
        this.selectDate.emit({
          startDate: selectedRange.startDate,
          endDate: selectedRange.endDate,
        });
      }
    }

    this.initialSelection = false;
  }
}
