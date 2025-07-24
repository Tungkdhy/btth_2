import { Component, EventEmitter, Output, PipeTransform } from '@angular/core';
import { AsyncPipe, DecimalPipe, NgFor } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-search-operator',
  standalone: true,
  imports: [
    CommonModule,
    DecimalPipe,
    NgFor,
    AsyncPipe,
    ReactiveFormsModule,
    NgbTypeaheadModule,
  ],
  templateUrl: './search-oper.component.html',
  providers: [DecimalPipe],
  styleUrls: ['./search-oper.component.scss'],
})
export class SearchOperatorComponent {
  uploadedFiles: File[] = [];
  @Output() filesUploaded = new EventEmitter<File[]>();

  onFileChange(event: any) {
    const files = event.target.files;
    if (files) {
      this.uploadedFiles = Array.from(files);
    }
    this.onFilesUploaded();
  }
  onFilesUploaded() {
    this.filesUploaded.emit(this.uploadedFiles);
  }
  removeFile(index: number) {
    this.uploadedFiles.splice(index, 1);
  }
}
