import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// import { MessageService } from 'primeng/api';
import { PrimeNG } from 'primeng/config';
import { ToastModule } from 'primeng/toast';
import { Header } from "./pages/header/header";
import { ApiService } from './api/apiCall';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastModule, Header],
  // providers: [MessageService],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('chatbotFE');
  public apiService = inject(ApiService);

  constructor(private primeng: PrimeNG) { }

  ngOnInit() {
    this.primeng.ripple.set(true);
  }

}
