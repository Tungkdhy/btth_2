import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  Renderer2,
  Inject,
} from '@angular/core';
import { DxTreeListModule, DxTreeViewModule } from 'devextreme-angular';
import { CommonModule } from '@angular/common';
import { SupabaseService } from 'src/app/modules/dashboard/services/supabase.service';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DOCUMENT } from '@angular/common';
@Component({
  selector: 'app-table-detail-1',
  standalone: true,
  imports: [CommonModule, DxTreeListModule, DxTreeViewModule],
  templateUrl: './table-detail-1.component.html',
  styleUrls: ['./table-detail-1.component.scss'],
})
export class TableDetail1Component implements OnInit {
  @Input() tableData: any;
  public dataSource: any[] = [];

  constructor(
    private supabase: SupabaseService,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  async ngOnInit() {
    let response = await this.supabase.getDanhSachDuPhong86();
    this.dataSource = this.buildTreeData(response.items);
    setTimeout(() => {
      const element = this.document.getElementById('Layer_1');
      if (element) {
        const clickEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window,
        });
        element.dispatchEvent(clickEvent);
      } else {
        console.error('Element with ID "Layer_1" not found.');
      }
    }, 1);
    console.log(this.dataSource);
    this.cdr.detectChanges();
  }

  displayExpr(item: any) {
    return item.name;
  }
  buildTreeData(data: any[]): any[] {
    const map = new Map<number, any>();
    const roots: any[] = [];

    data.forEach((item) => {
      map.set(item.id, { ...item, items: [] });
    });

    data.forEach((item) => {
      const parent = map.get(item.parent_id);
      if (parent) {
        parent.items.push(map.get(item.id));
      } else {
        roots.push(map.get(item.id));
      }
    });

    return roots;
  }

  onItemClick(event: any): void {
    console.log('Item clicked:', event.itemData);
  }
}
