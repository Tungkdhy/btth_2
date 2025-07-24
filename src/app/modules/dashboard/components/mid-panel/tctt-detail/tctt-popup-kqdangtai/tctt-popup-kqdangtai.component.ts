import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  inject,
  ChangeDetectorRef,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TreeViewModule } from '@syncfusion/ej2-angular-navigations';
import {
  GridModule,
  EditService,
  ToolbarService,
  PageService,
} from '@syncfusion/ej2-angular-grids';
import { SupabaseService } from '../../../../services/supabase.service';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { BreadcrumLeftRightComponent } from "../../../shared/breadcrum-left-right/breadcrum-left-right.component";
@Component({
  selector: 'app-tctt-popup-kqdangtai',
  templateUrl: './tctt-popup-kqdangtai.component.html',
  styleUrls: ['./tctt-popup-kqdangtai.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TreeViewModule,
    GridModule,
    NgbPaginationModule,
    BreadcrumLeftRightComponent
],
  providers: [EditService, ToolbarService, PageService],
  encapsulation: ViewEncapsulation.None,
})
export class TcttPopupKqdangtaiComponent implements OnInit {
  isPopupVisible: boolean = false;
  @Output() togglePopupEvent = new EventEmitter<boolean>();
  @Input() muctieubaoveDetail: any[] = [];
  @Input() dataDetail: any;

  public treeData: any = [];
  public gridData: any[] = [];
  public originalGridData: any[] = [];
  public selectedNode: any;
  public pageSettings = {};
  private cdr = inject(ChangeDetectorRef);
  private supabase = inject(SupabaseService);

  page: number = 1;
  pageSize: number = 10;

  public searchText: string = '';

  ngOnInit(): void {
    this.originalGridData = this.dataDetail?.map((item: any, index: any) => ({
      ...item,
      index: index + 1,
    }));
    this.gridData = [...this.originalGridData];
  }

  get filteredData(): any {
    const searchLower = this.searchText.toLowerCase();
    return this.gridData
      .filter(
        (item) =>
          item?.tendonvi?.toLowerCase().includes(searchLower) ||
          item?.tenkenh?.toLowerCase().includes(searchLower) ||
          item?.duongdan?.toLowerCase().includes(searchLower),
      )
      .slice((this.page - 1) * this.pageSize, this.page * this.pageSize);
  }

  // xử lý sự kiện đóng popup từ component con tới component cha
  togglePopup(isPopupVisible: boolean) {
    this.togglePopupEvent.emit(isPopupVisible);
  }

  onPageChange(page: number) {
    this.page === page;
  }
}
