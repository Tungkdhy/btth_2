import { ChangeDetectorRef, Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { SupabaseService } from 'src/app/modules/dashboard/services/supabase.service';

@Component({
  selector: 'app-application-card',
  standalone: true,
  imports: [CommonModule,NgbPaginationModule],
  templateUrl: './application-card.component.html',
  styleUrls: ['./application-card.component.scss'],
})
export class ApplicationCardComponent implements OnInit {

  @Input() serial_number:any;
  device:any;
  dataSource:any[]=[];
  pageFmc = 1;
  pageSizeFmc = 5;
  totalFmc =0;

  pageTA21 = 1;
  pageSizeTA21 = 5;
  totalTA21 =0;

  constructor(
    private cdr: ChangeDetectorRef,
    private supabaseService: SupabaseService
  ){

  }

  async ngOnInit() {
    this.device = await this.supabaseService.getDetailClientServer(this.serial_number);
  }
  async onPageChange(page: number) {
    this.pageFmc = page;
    this.cdr.detectChanges();

  }
  getValue(item:string){
    try{
      return JSON.parse(item)?.display_name;
    }catch(e){
      return item;
    }

  }
}
