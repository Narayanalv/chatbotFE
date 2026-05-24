import { Component } from '@angular/core';
import { Header } from '../header/header';
import { AuthService } from '../../api/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Header],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  constructor(private authService: AuthService, private router: Router) {
  }
  buildBot() {
    if (this.authService.isLogin()) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
