import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  isLogin = true;
  needConfirm = false;
  email = '';
  password = '';
  username = '';
  confirmationCode = '';
  error = '';
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  isValid(): boolean {
    if (this.needConfirm) {
      return !!this.confirmationCode;
    }
    if (this.isLogin) {
      return !!this.email && !!this.password;
    }
    return !!this.email && !!this.password && !!this.username;
  }

  async onSubmit() {
    if (!this.isValid()) {
      this.error = '请填写所有字段';
      return;
    }

    try {
      if (this.needConfirm) {
        await this.authService.confirmSignUp(this.email, this.confirmationCode);
        this.needConfirm = false;
        this.isLogin = true;
        this.error = '邮箱验证成功，请登录';
        this.confirmationCode = '';
      } else if (this.isLogin) {
        await this.authService.login(this.email, this.password);
        this.router.navigate(['/projects']);
      } else {
        await this.authService.register(this.email, this.password, this.username);
        this.needConfirm = true;
        this.error = '注册成功，请查收邮箱并输入确认码';
      }
    } catch (error: any) {
      this.error = error.message || '操作失败，请重试';
      console.error('操作失败:', error);
    }
  }

  toggleForm() {
    this.isLogin = !this.isLogin;
    this.needConfirm = false;
    this.error = '';
    this.email = '';
    this.password = '';
    this.username = '';
    this.confirmationCode = '';
  }

  toggleMode() {
    if (!this.needConfirm) {
      this.isLogin = !this.isLogin;
      this.resetForm();
    }
  }

  resetForm() {
    this.email = '';
    this.password = '';
    this.username = '';
    this.confirmationCode = '';
    this.error = '';
  }
}
