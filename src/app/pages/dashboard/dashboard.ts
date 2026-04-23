import { Component, OnInit } from '@angular/core';
import { Header } from '../header/header';
import { AuthService } from '../../api/auth';
import { RouterLink, Router } from '@angular/router';
import { ChatBot, ChatBotResponse } from '../../model/todos.type';
import { ApiService } from '../../api/apiCall';
import { ToastService } from '../../api/toastService/toast.service';

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
export class Dashboard implements OnInit {
  chatBotList: ChatBot[] = [];
  isSidebarOpen: boolean = true;
  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router,
    private toast: ToastService,
  ) { }

  ngOnInit(): void {
    if (!this.authService.isLogin()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadBots();
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  loadBots() {
    this.apiService.getBots().subscribe({
      next: (response: ChatBotResponse) => {
        console.log(response);
        this.chatBotList = response.chatBot;
      },
      error: (err) => {
        console.log(err);
        this.toast.showError(err.error?.message || 'Login failed. Please try again.');
      }
    });
  }
}

