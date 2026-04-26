import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ChatBot } from '../../model/todos.type';
import { ApiService } from '../../api/apiCall';
import { log } from 'console';

@Component({
  selector: 'app-chat-ui',
  imports: [DatePipe],
  templateUrl: './chat-ui.html',
  styleUrl: './chat-ui.css',
})
export class ChatUi {
  @Input() botData!: ChatBot;
  @Output() close = new EventEmitter<void>();
  inputDisabled: boolean = false;
  messages: { sender: 'user' | 'bot', text: string, time: Date }[] = [];
  isMinimized: boolean = false;

  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    // Add initial bot greeting
    this.messages.push({
      sender: 'bot',
      text: `Hi there! I'm **${this.botData.title}**. I'm ready to help you with anything related to *${this.botData.topic}*. How can I assist you today?`,
      time: new Date()
    });
  }

  toggleMinimize() {
    this.isMinimized = !this.isMinimized;
  }

  sendMessage(messageInput: HTMLInputElement) {
    const message = messageInput.value.trim();
    if (!message) return;

    // Add user message
    this.messages.push({ sender: 'user', text: message, time: new Date() });
    messageInput.value = ''; // clear input
    this.inputDisabled = true;
    this.cdr.detectChanges();

    this.apiService.testChatbot(this.botData.id, message).subscribe({
      next: (res: any) => {
        console.log(res, "test")
        this.messages.push({ sender: 'bot', text: res.messageText || res.message || 'No response', time: new Date() });
        this.inputDisabled = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.messages.push({ sender: 'bot', text: 'Sorry, I encountered an error. Please try again.', time: new Date() });
        this.inputDisabled = false;
        this.cdr.detectChanges();
      }
    });
  }
}
