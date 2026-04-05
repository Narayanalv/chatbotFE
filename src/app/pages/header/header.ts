import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { isLogin, logout as authLogout } from '../../api/auth';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  constructor(private themeService: ThemeService, private router: Router) { }

  toggleTheme() {
    this.themeService.toggle();
  }

  isUserLogin = isLogin();

  logout() {
    authLogout();
    this.isUserLogin = false;
    this.router.navigate(['/login']);
  }
}
