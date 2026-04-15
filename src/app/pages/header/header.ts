import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../api/auth';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  isUserLogin: boolean = false;

  constructor(private themeService: ThemeService, private router: Router, private authService: AuthService) {
    this.initializeLoginStatus();
  }
  
  private async initializeLoginStatus() {
    this.isUserLogin = await this.authService.isLogin();
    console.log('Header component initialized. User login status:', this.isUserLogin);
  }
  
  toggleTheme() {
    this.themeService.toggle();
  }

  logout() {
    this.authService.logout();
    this.isUserLogin = false;
    this.router.navigate(['/login']);
  }
}
