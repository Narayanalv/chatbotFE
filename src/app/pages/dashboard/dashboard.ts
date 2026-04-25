import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Header } from '../header/header';
import { AuthService } from '../../api/auth';
import { RouterLink, Router } from '@angular/router';
import { ChatBot, ChatBotResponse } from '../../model/todos.type';
import { ApiService } from '../../api/apiCall';
import { ToastService } from '../../api/toastService/toast.service';
import { AddBot } from '../add-bot/add-bot';
import { ListBots } from '../list-bots/list-bots';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    Header,
    RouterLink,
    AddBot,
    ListBots
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  chatBotList: ChatBot[] = [];
  isSidebarOpen: boolean = true;
  addBot: boolean = false;
  botsLoading: boolean = false;
  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router,
    private toast: ToastService,
    private cdr: ChangeDetectorRef
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

  loadBots(isBackgroundUpdate = false) {
    if (!isBackgroundUpdate) {
      this.botsLoading = true;
    }
    this.apiService.getBots().subscribe({
      next: (response: ChatBotResponse) => {
        this.chatBotList = response.listBot || [];
        this.botsLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.toast.showError("Failed to load bots");
        this.botsLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}

