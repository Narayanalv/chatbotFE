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

  constructor(public apiService: ApiService, private toast: ToastService) { }

  addBot(title: string, topic: string, file: File | null | undefined) {
    console.log(title, topic, file);
    const trimmedTitle = title.trim();
    const trimmedTopic = topic.trim();

    if (!trimmedTitle) {
      this.toast.showError("Please enter a title");
      return;
    }
    if (!trimmedTopic) {
      this.toast.showError("Please enter a topic");
      return;
    }
    if (!file) {
      this.toast.showError("Please select a file");
      return;
    }
    {
      this.apiService.addChatBot({
        title,
        topic,
        image: file,
      }).subscribe({
        next: (res) => {
          console.log(res);
          this.loadBots.emit();
          this.close.emit();
        },
        error: (err) => {
          console.log(err);
        }
      })
    }
  }
}
