import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  Output,
  QueryList,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav-tabs.component.html',
  styleUrls: ['./nav-tabs.component.scss'],
})
export class NavTabsComponent implements AfterContentInit {
  @Input() tabs: { label: string; value: any }[] = [];
  @Input() activeTab: any;
  @Output() tabChange = new EventEmitter<any>();

  @ContentChildren(TemplateRef) tabContents!: QueryList<TemplateRef<any>>;

  contentMap: { [key: string]: TemplateRef<any> } = {};

  ngAfterContentInit() {
    this.tabs.forEach((tab, index) => {
      this.contentMap[tab.value] = this.tabContents.toArray()[index];
    });
  }

  selectTab(tab: any) {
    this.activeTab = tab.value;
    this.tabChange.emit(this.activeTab);
  }

  getActiveContent(): TemplateRef<any> | null {
    return this.contentMap[this.activeTab] || null;
  }
}
