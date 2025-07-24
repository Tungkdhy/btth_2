import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { newInstance } from '@jsplumb/browser-ui';
import { BlankEndpoint } from '@jsplumb/core';
import { FlowchartConnector } from '@jsplumb/connector-flowchart';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipModule } from '@syncfusion/ej2-angular-popups';
import { CONFIG } from 'src/environments/environment';

@Component({
  selector: 'app-operational-detail-command',
  templateUrl: './operational-command.component.html',
  styleUrls: ['./operational-command.component.scss'],
  standalone: true,
  imports: [CommonModule, TooltipModule],
})
export class OperationalDetailCommandComponent
  implements AfterViewInit, OnChanges
{
  @Input() mainType: string = '';
  @Input() dataChiTietNhiemVuPopup: any;
  isPopupVisible: boolean = false;
  @Output() togglePopupEvent = new EventEmitter<boolean>();
  shiftOperation: any = {
    DoKhan: 'Thường',
    DonViXuLy: ' Viện 10, Phòng Tham mưu',
    ID_DoKhan: '1',
    ID_LoaiTin: 1,
    ID_NguoiGiao: '2',
    ID_NguonTin: 3,
    ID_VuViec: null,
    LoaiTin: 'Trinh sát, giám sát',
    NgayGiao: '21/07/2024',
    NguoiGiao: 'Thủ trưởng B',
    NguonTin: 'Thủ trưởng BTL',
    NhiemVu:
      'Trich yeudsajkhfkjahdsfjhasdjhfkjhasdklhfkjlasdhfkjhadskhfkjashfkjhasdkjlhfkjhaskjdhfkjlahsdfkjhaksjdhfkjhasfhdasjhfhjashjdfjhaskdjhfkjalshflkjasdhfkjlhaskljhfkljasddfkjhaksjlhdfkjashdfkjhdsaklfjhdsakljhfkljasdh',
    NoiDung: 'Van',
    ThoiHanXuLy: '30/07/2024',
    VuViec: '',
    idNhiemVu: 20075,
    linkfiles: [
      {
        Linkfile: 'http://localhost:10000/qldh/DNP2801?id=5049',
        TenFile: 'Capture.PNG',
      },
      {
        Linkfile: 'http://localhost:10000/qldh/DNP2801?id=5050',
        TenFile: 'layout_sch_btl.png',
      },
    ],
  };
  page: number = 1;
  page_size = 3;
  tasks: any = [];
  listNhatKyNhiemVu: any = [];
  @ViewChild('container') container!: ElementRef<HTMLElement>;
  private jsPlumbInstance: any;

  constructor(private cdr: ChangeDetectorRef) {}

  togglePopup(isPopupVisible: boolean) {
    this.togglePopupEvent.emit(isPopupVisible);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dataChiTietNhiemVuPopup']) {
      this.updateData();
    }
  }

  async updateData() {
    this.shiftOperation = this.dataChiTietNhiemVuPopup;

    let responseCayNhiemVu = await fetch(
      `${CONFIG.API.BACKEND.DIEU_HANH_TRUC_URL}/api/TinBai_LuongXuLy?id=${this.shiftOperation?.idNhiemVu}`,
    );
    this.listNhatKyNhiemVu = await fetch(
      `${CONFIG.API.BACKEND.DIEU_HANH_TRUC_URL}/api/TinBai_NhatKy?id=${this.shiftOperation?.idNhiemVu}`,
    );
    this.listNhatKyNhiemVu = await this.listNhatKyNhiemVu.json();
    this.tasks = await responseCayNhiemVu.json();
    this.cdr.detectChanges();

    setTimeout(() => {
      this.initjsPlumb();
    }, 5000);
  }

  async ngOnInit(): Promise<void> {
    await this.updateData();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initjsPlumb();
    }, 5000);
  }

  private initjsPlumb(): void {
    if (!this.tasks || this.tasks.length === 0) {
      console.error('Tasks data is missing or empty.');
      return;
    }

    const container = this.container.nativeElement;
    const configs: any = {
      container: container,
      connector: {
        type: FlowchartConnector.type,
        options: {
          cornerRadius: 0,
          connectorStyle: {
            strokeStyle: 'red',
            outlineColor: 'red',
          },
        },
      },
      endpoint: {
        type: BlankEndpoint.type,
      },
    };
    this.jsPlumbInstance = newInstance(configs);

    const taskMap = new Map<string, HTMLElement>();
    this.tasks.forEach((task: any) => {
      const element = document.querySelector(`#task-${task.id}`) as HTMLElement;
      if (element) {
        taskMap.set(task.id, element);
      } else {
        console.error(`Element not found for task ${task.id}`);
      }
    });

    const positionTasks = (
      tasks: any[],
      parentId: string | null,
      xOffset: number,
      yOffset: number,
      level: number,
    ) => {
      const stepX = 250;
      const stepY = 300;
      let y = yOffset + level * stepY;

      const childTasks = tasks.filter((task) => task.idcha === parentId);
      const totalWidth = (childTasks.length - 1) * stepX;
      let x = xOffset - totalWidth / 2;

      childTasks.forEach((task, index) => {
        const element = taskMap.get(task.id);
        if (element) {
          element.style.left = `${x}px`;
          element.style.top = `${y}px`;

          if (parentId) {
            const parentElement = taskMap.get(parentId);
            if (parentElement) {
              this.jsPlumbInstance.connect({
                source: this.jsPlumbInstance.addEndpoint(parentElement, {
                  anchor: 'Continuous',
                }),
                target: this.jsPlumbInstance.addEndpoint(element, {
                  anchor: 'Continuous',
                }),
                overlays: [
                  {
                    type: 'Arrow',
                    options: {
                      location: 1,
                      width: 10,
                      length: 10,
                      paintStyle: {
                        strokeWidth: 2,
                      },
                    },
                  },
                ],
              });
            }
          }

          positionTasks(this.tasks, task.id, x, y + stepY, level + 1);
          x += stepX;
        }
      });
    };

    const containerWidth = container.clientWidth;
    positionTasks(this.tasks, null, containerWidth / 2, 20, 0);
  }
  getLastActive(time: string) {
    if (!time) {
      return '';
    }
    const date = new Date(time);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  }
}
