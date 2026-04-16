import { Component, OnInit } from '@angular/core';
import { Header } from '../header/header';
import { RouterLink, Router } from '@angular/router';
import { ApiService } from '../../api/apiCall';
import { AuthService } from '../../api/auth';
import { ToastService } from '../../api/toastService/toast.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [Header, RouterLink],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage implements OnInit {
  isLogin: boolean;
  isLoginPage: boolean;
  isOtpMode: boolean
  viewPasword: boolean;
  viewCPassword: boolean;
  isLoading: boolean;
  email: string;

  constructor(private apiService: ApiService, private router: Router, private authService: AuthService, private toast: ToastService) {
    this.isLoginPage = true;
    this.isOtpMode = false;
    this.viewPasword = false;
    this.viewCPassword = false;
    this.isLogin = false;
    this.isLoading = false;
    this.email = '';
  }

  async ngOnInit() {
    this.isLogin = await this.authService.isLogin();
    this.isLoginPage = !this.isLogin;
    if (this.isLogin) {
      this.router.navigate(['/']);
    }
  }
  toggleForm() {
    this.isLoginPage = !this.isLoginPage;
    this.isOtpMode = false;
  }

  togglePassword() {
    this.viewPasword = !this.viewPasword;
  }

  toggleCPassword() {
    this.viewCPassword = !this.viewCPassword;
  }

  showOtpForm() {
    this.isOtpMode = true;
  }

  backToRegister() {
    this.isOtpMode = false;
  }

  login(email: string, password: string, rememberMe: boolean) {
    console.log(email, password, rememberMe);
    this.apiService.login({ email, password, rememberMe }).
      subscribe({
        next: (res) => {
          console.log(res);
          this.email = email;
          if (res.accessToken) {
            localStorage.setItem('accessToken', res.accessToken);
            this.router.navigate(['/']);
          }
        },
        error: (err) => {
          console.log(err);
          this.toast.showError(err.error?.message || 'Login failed. Please try again.');
        }
      })
  }

  register(name: string, email: string, password: string, confirmPassword: string) {
    console.log(name, email, password, confirmPassword);
    this.apiService.register({ name, email, password, confirmPassword }).
      subscribe({
        next: (res) => {
          console.log(res);
          this.email = email;
          this.showOtpForm();
        },
        error: (err) => {
          console.log(err);
          this.toast.showError(err.error?.message || 'Login failed. Please try again.');
        }
      })
  }

  verifyOtp(otp: string) {
    console.log(otp);
    this.apiService.verifyOTP({ email: this.email, otp: Number(otp) }).
      subscribe({
        next: (res) => {
          console.log(res);
          if (res.accessToken) {
            localStorage.setItem('accessToken', res.accessToken);
          }
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.log(err);
          this.toast.showError(err.error?.message || 'Login failed. Please try again.');
        }
      })
  }
}
