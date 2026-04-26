import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// import { MessageService } from 'primeng/api';
import { PrimeNG } from 'primeng/config';
import { ToastModule } from 'primeng/toast';
import { Header } from "./pages/header/header";

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
  constructor(private primeng: PrimeNG) { }

  ngOnInit() {
    this.primeng.ripple.set(true);
  }

}
