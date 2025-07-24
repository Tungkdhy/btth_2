import {Component, forwardRef, Input, ViewChild} from '@angular/core';
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import {TextBoxComponent, TextBoxModule} from "@syncfusion/ej2-angular-inputs";

@Component({
  selector: 'app-neun-text-autosize-form',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => NeunTextAutosizeFormComponent),
    },
  ],
  imports: [TextBoxModule],
  templateUrl: './neun-text-autosize-form.component.html',
  styleUrls: ['./neun-text-autosize-form.component.scss']
})
export class NeunTextAutosizeFormComponent {
  @Input() readonly: boolean = false;
  @Input() placeholder: string = '';

  value: string = '';

  constructor() {}

  onChange = (text: string) => {};

  onTouched = () => {};

  onChangeText(event: any) {
    this.onTouched();
    this.value = event.value;
    this.onChange(this.value);
  }

  writeValue(value: any) {
    this.value = value;
  }

  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }

  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }

  @ViewChild('default')
  public textareaObj: TextBoxComponent;
  public createHandler(): void {
    this.textareaObj.addAttributes({ rows: '1' });
    this.textareaObj.element.style.height = 'auto';
    this.textareaObj.element.style.height =
      this.textareaObj.element.scrollHeight + 'px';
  }
  public inputHandler(): void {
    this.textareaObj.element.style.height = 'auto';
    this.textareaObj.element.style.height =
      this.textareaObj.element.scrollHeight + 'px';
  }
}
