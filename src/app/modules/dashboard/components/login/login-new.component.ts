import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { SupabaseService } from '../../services/supabase.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-left-panel',
  standalone: true,
  imports: [CommonModule, TextBoxModule, FormsModule, ButtonModule],
  templateUrl: './login-new.component.html',
  styleUrls: ['./login-new.component.scss'],
})
export class LoginNewComponent implements OnInit {
  constructor(
    private supabase: SupabaseService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {}

  email: string = ''; //'huy@tt1.com'
  password: string = ''; //'123@abc',
  onLogin = async () => {
    // const { data, error } = await this.supabase.signIn(this.email, this.password);
    // if(error){
    //   console.log("Lỗi đăng nhập");
    // }
    // const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    // this.router.navigate([returnUrl])
    // console.log('Đăng nhập thành công');
  };
}
