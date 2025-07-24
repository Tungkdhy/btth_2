import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx'; // Thư viện để tạo file Excel
import { saveAs } from 'file-saver'; // Thư viện để lưu file
import { formatDate } from '@angular/common';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  async exportExcel(data_sheet:any,file_name:string){

    console.log("data sgeet",data_sheet);
    // Tạo một work sheet từ dữ liệu
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data_sheet || []);

      // Tạo work book chứa work sheet
      const workbook: XLSX.WorkBook = {
        Sheets: { 'Sheet': worksheet },
        SheetNames: ['Sheet']
      };

      // Tạo file Excel dưới dạng buffer
      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

      // Lưu file Excel với thư viện file-saver
      this.saveAsExcelFile(excelBuffer, file_name);
    }

    private saveAsExcelFile(buffer: any, fileName: string): void {
      const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
      saveAs(data, `${fileName}_${formatDate(new Date(),"dd-MM-yyyy HH:mm:ss",'en-US')}.xlsx`);
  }
}
