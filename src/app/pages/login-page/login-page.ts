import { Component, OnInit } from '@angular/core';
import { Header } from '../header/header';
import { RouterLink, Router } from '@angular/router';
import { ApiService } from '../../api/apiCall';
import { authConfig, AuthService } from '../../api/auth';
import { ToastService } from '../../api/toastService/toast.service';
import { OAuthService } from 'angular-oauth2-oidc';

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


  constructor(private apiService: ApiService, private oauthService: OAuthService, private router: Router, private authService: AuthService, private toast: ToastService) {
    this.viewPasword = false;
    this.viewCPassword = false;
    this.isLogin = false;
    this.isLoading = false;
    this.email = '';
    this.newPassword = '';

    // Restore the page state from sessionStorage (survives the Google redirect)
    const savedPage = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('google_auth_page') : null;
    this.page = savedPage ?? 'login';

    // Guard: angular-oauth2-oidc uses window internally, which doesn't exist during SSR
    if (typeof window !== 'undefined') {
      this.oauthService.configure(authConfig);
      this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
        if (this.oauthService.hasValidIdToken()) {
          const idToken = this.oauthService.getIdToken();
          console.log(idToken)
          const authPage = sessionStorage.getItem('google_auth_page');
          sessionStorage.removeItem('google_auth_page'); // Clean up

          if (authPage === 'register') {
            // User clicked "Sign up with Google" → register endpoint
            this.apiService.googleRegisterWithToken(idToken).subscribe({
              next: (res) => {
                if (res.accessToken) {
                  localStorage.setItem('accessToken', res.accessToken);
                  this.router.navigate(['/']);
                }
              },
              error: (err) => this.toast.showError(err.error?.message ?? 'Registration failed. Account may already exist.')
            });
          } else {
            // User clicked "Sign in with Google" → login endpoint
            this.apiService.googleLoginWithToken(idToken).subscribe({
              next: (res) => {
                if (res.accessToken) {
                  localStorage.setItem('accessToken', res.accessToken);
                  this.router.navigate(['/']);
                }
              },
              error: (err) => {
                console.log(err);
                this.toast.showError(err.error?.message ?? 'Login failed. Please register first.')
              }
            });
          }
        }
      });
    }
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

  handleGoogleSignIn() {
    // Save which page (login or register) the user is on before redirecting to Google
    sessionStorage.setItem('google_auth_page', this.page);
    this.oauthService.initImplicitFlow();
  }
}
