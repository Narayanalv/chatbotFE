import { Component } from '@angular/core';
import { Header } from '../header/header';
import { RouterLink, Router } from '@angular/router';
import { ApiService } from '../../api/apiCall';

@Component({
  selector: 'app-login-page',
  imports: [Header, RouterLink],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  isLoginPage = true;
  isOtpMode = false;
  viewPasword = false;
  viewCPassword = false;
  email: string = '';
  constructor(private apiService: ApiService, private router: Router) { }
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
          } else {
            this.showOtpForm();
          }
        },
        error: (err) => {
          console.log(err);
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
        }
      })
  }
}
