import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  HostListener,
  inject,
  Input,
} from '@angular/core';
import { NgIf, NgOptimizedImage } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-neun-file-upload',
  standalone: true,
  imports: [NgOptimizedImage, NgIf],
  templateUrl: './neun-file-upload.component.html',
  styleUrls: ['./neun-file-upload.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NeunFileUploadComponent),
      multi: true,
    },
  ],
})
export class NeunFileUploadComponent implements ControlValueAccessor {
  @Input() url: string = '';

  file: File | null = null;

  @HostListener('change', ['$event.target.files']) emitFiles(event: FileList) {
    const file = event && event.item(0);
    this.file = file;
    if (file instanceof File) {
      this.readFile(file);
      this.onChange(file);
    }
  }

  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  constructor(private host: ElementRef<HTMLInputElement>) {}

  onChange(value: any) {}
  onTouched: any = () => {};

  isDisabled: boolean = false;

  writeValue(value: string) {
    if (!value) return;
    this.url = value;
    this.onChange(
      this._dataUrlToFile(this.url, this._generateRandomFileName()),
    );
    this.cdr.markForCheck();
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.isDisabled = isDisabled;
  }

  readFile(file: File): any {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = this._handleReaderLoaded.bind(this);
  }

  private _handleReaderLoaded(e: ProgressEvent<FileReader>) {
    let reader = e.target;
    if (!reader) {
      return;
    }
    this.url = reader.result as string;
    this.cdr.markForCheck();
  }

  private _dataUrlToFile(dataUrl: string, filename: string) {
    const parts = dataUrl.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const data = atob(parts[1]);

    const uint8Array = new Uint8Array(data.length);
    for (let i = 0; i < data.length; i++) {
      uint8Array[i] = data.charCodeAt(i);
    }

    const blob = new Blob([uint8Array], { type: contentType });

    return new File([blob], filename, { type: contentType });
  }

  private _generateRandomFileName() {
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(2, 8); // Generates a random string
    return `${timestamp}_${randomString}`;
  }
}
