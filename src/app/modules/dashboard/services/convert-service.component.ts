import { Component, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ConvertServiceComponent {

  getName(name:string) {
    let key:any={
      A40:"Miền Bắc",
      A91:"Miền Trung",
      A99:"Miền Nam"
    }
    return key[name]
  }
  getRegionType(name:string) {
    let key:any={
      north:"A40",
      central:"A91",
      south:"A99"
    }
    return key[name]||null
  }
  getTypeNetwork(type:string){
    let key:any={
      QS:"Quân sự",
      INT: "Internet",
      CD:"Chuyên dùng",
    };
    return key[type] || "";
  }
  getTypeSecurity(type:string){
    let key:any={
      'MALWARE':"Mã độc",
      'BLACK_DOMAIN':"Tên miền độc hại",
      'INTERNET':"Kết nối Internet",
      'HUNTING':"Bất thường"
    };

    return key[type]||'';
  }
}
