import { Component } from '@angular/core';
import { Header } from '../header/header';
import { AuthService } from '../../api/auth';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    Header,
    RouterLink
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

  constructor (private authService: AuthService,private router: Router){
    if(!this.authService.isLogin()){
      this.router.navigate(['/login']);
    }
  }

}
