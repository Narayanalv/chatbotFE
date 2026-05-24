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
  styleUrls: ['./login-page.css'],
})
export class LoginPage implements OnInit {
  isLogin: boolean;
  viewPasword: boolean;
  viewCPassword: boolean;
  isLoading: boolean;
  email: string;
  page: string;
  newPassword: string;


  constructor(private apiService: ApiService, private router: Router, private authService: AuthService, private toast: ToastService) {
    this.viewPasword = false;
    this.viewCPassword = false;
    this.isLogin = false;
    this.isLoading = false;
    this.email = '';
    this.newPassword = '';
    this.page = 'login';
  }

  async ngOnInit() {
    this.isLogin = await this.authService.isLogin();
    if (this.isLogin) {
      this.router.navigate(['/']);
    }
  }
  toggleForm(form: string) {
    this.page = form;
  }

  togglePassword() {
    this.viewPasword = !this.viewPasword;
  }

  toggleCPassword() {
    this.viewCPassword = !this.viewCPassword;
  }

  showOtpForm() {
    this.page = 'verify';
  }

  login(email: string, password: string) {
    console.log(email, password);
    this.apiService.login({ email, password }).
      subscribe({
        next: (res) => {
          this.email = email;
          if (res.accessToken) {
            localStorage.setItem('accessToken', res.accessToken);
            this.router.navigate(['/']);
          }
        },
        error: (err) => {
          this.toast.showError(err.error.message);
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
          this.toggleForm('verify');
        },
        error: (err) => {
          console.log(err);
          this.toast.showError(err.error.message);
        }
      })
  }

  verifyOtp(otp: string) {
    console.log(otp);
    this.apiService.verifyOTP({ email: this.email, otp: otp }).
      subscribe({
        next: (res) => {
          console.log(res);
          if (res.accessToken) {
            localStorage.setItem('accessToken', res.accessToken);
          }
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.toast.showError(err.error.message);
        }
      })
  }

  forgotPassword(email: string) {
    this.isLoading = true;
    this.apiService.forgotPassword({ email }).subscribe({
      next: (res) => {
        this.email = email;
        this.isLoading = false;
        this.toggleForm('forgot-verify');
      },
      error: (err) => {
        this.isLoading = false;
        this.toast.showError(err.error?.message ?? 'Something went wrong');
      }
    });
  }

  verifyForgotOtp(otp: string) {
    this.isLoading = true;
    this.apiService.verifyForgot({ email: this.email, otp: otp }).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.accessToken) {
          localStorage.setItem('accessToken', res.accessToken);
        }
        this.toggleForm('reset');
      },
      error: (err) => {
        this.isLoading = false;
        this.toast.showError(err.error?.message ?? 'Something went wrong');
      }
    });
  }

  resetPassword(password: string, confirmPassword: string) {
    if (password !== confirmPassword) {
      this.toast.showError('Passwords do not match');
      return;
    }
    this.isLoading = true;
    this.apiService.resetPassword({ password, confirmPassword }).subscribe({
      next: (res) => {
        this.isLoading = false;
        localStorage.removeItem('accessToken');
        this.toggleForm('login');
      },
      error: (err) => {
        this.isLoading = false;
        this.toast.showError(err.error?.message ?? 'Something went wrong');
      }
    });
  }
}
