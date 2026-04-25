import { Component, EventEmitter, Output } from '@angular/core';
import { ApiService } from '../../api/apiCall';
import { ToastService } from '../../api/toastService/toast.service';
import { ChatBot } from '../../model/todos.type';

@Component({
  selector: 'app-add-bot',
  standalone: true,
  imports: [],
  templateUrl: './add-bot.html',
  styleUrl: './add-bot.css',
})
export class AddBot {
  @Output() close = new EventEmitter<void>();
  @Output() loadBots = new EventEmitter<void>();

  constructor(private apiService: ApiService, private toast: ToastService) { }

  addBot(title: string, topic: string, file: File | null | undefined) {
    console.log(title, topic, file);
    if (!file) {
      this.toast.showError("Please select a file")
    } else {
      this.apiService.addChatBot({
        title,
        topic,
        image: file,
      }).subscribe({
        next: (res) => {
          console.log(res);
          this.loadBots.emit();
        },
        error: (err) => {
          console.log(err);
          this.toast.showError(err.error.message)
        }
      })
    }
  }
}
