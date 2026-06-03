import { Component, Input, Output, EventEmitter, ChangeDetectorRef, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ChatBot, ChatHistoryItem } from '../../model/todos.type';
import { ApiService } from '../../api/apiCall';

@Component({
  selector: 'app-chat-ui',
  imports: [DatePipe],
  templateUrl: './chat-ui.html',
  styleUrl: './chat-ui.css',
})
export class ChatUi implements AfterViewChecked {
  @Input() botData!: ChatBot;
  @Output() close = new EventEmitter<void>();
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  inputDisabled: boolean = false;
  messages: { sender: 'user' | 'bot', text: string, time: Date }[] = [];
  isMinimized: boolean = false;

  // History state
  historyLoading: boolean = false;
  historyLoaded: boolean = false;
  currentPage: number = 0;
  totalPages: number = 0;
  hasMoreHistory: boolean = false;
  private shouldScrollToBottom: boolean = false;

  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.loadHistory();
  }

  ngAfterViewChecked() {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch (err) { }
  }

  loadHistory() {
    this.historyLoading = true;
    this.cdr.detectChanges();

    this.apiService.getChatHistory(this.botData.id, 0, 50).subscribe({
      next: (res: any) => {
        if (res.history && res.history.length > 0) {
          // Convert history items to message format (oldest first)
          const historyMessages = res.history
            .reverse()
            .flatMap((item: ChatHistoryItem) => {
              const msgs: { sender: 'user' | 'bot', text: string, time: Date }[] = [];
              if (item.message) {
                msgs.push({ sender: 'user', text: item.message, time: new Date(item.createdAt) });
              }
              if (item.responseMessage) {
                msgs.push({ sender: 'bot', text: item.responseMessage, time: new Date(item.createdAt) });
              }
              return msgs;
            });

          this.messages = historyMessages;
          this.currentPage = res.currentPage;
          this.totalPages = res.totalPages;
          this.hasMoreHistory = res.currentPage < res.totalPages - 1;
        } else {
          // No history, show greeting
          this.messages.push({
            sender: 'bot',
            text: `Hi there! I'm <b>${this.botData.title}</b>. I'm ready to help you with anything related to <i>${this.botData.topic}</i>. Ask me anything!`,
            time: new Date()
          });
        }

        this.historyLoading = false;
        this.historyLoaded = true;
        this.shouldScrollToBottom = true;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load history:', err);
        // Fallback to greeting
        this.messages.push({
          sender: 'bot',
          text: `Hi there! I'm <b>${this.botData.title}</b>. I'm ready to help you with anything related to <i>${this.botData.topic}</i>. Ask me anything!`,
          time: new Date()
        });
        this.historyLoading = false;
        this.historyLoaded = true;
        this.shouldScrollToBottom = true;
        this.cdr.detectChanges();
      }
    });
  }

  loadMoreHistory() {
    if (!this.hasMoreHistory || this.historyLoading) return;

    this.historyLoading = true;
    const nextPage = this.currentPage + 1;
    this.cdr.detectChanges();

    this.apiService.getChatHistory(this.botData.id, nextPage, 50).subscribe({
      next: (res: any) => {
        if (res.history && res.history.length > 0) {
          const olderMessages = res.history
            .reverse()
            .flatMap((item: ChatHistoryItem) => {
              const msgs: { sender: 'user' | 'bot', text: string, time: Date }[] = [];
              if (item.message) {
                msgs.push({ sender: 'user', text: item.message, time: new Date(item.createdAt) });
              }
              if (item.responseMessage) {
                msgs.push({ sender: 'bot', text: item.responseMessage, time: new Date(item.createdAt) });
              }
              return msgs;
            });

          // Prepend older messages at the top
          this.messages = [...olderMessages, ...this.messages];
          this.currentPage = res.currentPage;
          this.hasMoreHistory = res.currentPage < res.totalPages - 1;
        }

        this.historyLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load more history:', err);
        this.historyLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  toggleMinimize() {
    this.isMinimized = !this.isMinimized;
    if (!this.isMinimized) {
      this.shouldScrollToBottom = true;
    }
  }

  sendMessage(messageInput: HTMLInputElement) {
    const message = messageInput.value.trim();
    if (!message) return;

    // Add user message
    this.messages.push({ sender: 'user', text: message, time: new Date() });
    messageInput.value = ''; // clear input
    this.inputDisabled = true;
    this.shouldScrollToBottom = true;
    this.cdr.detectChanges();

    this.apiService.testChatbot(this.botData.id, message).subscribe({
      next: (res: any) => {
        this.messages.push({ sender: 'bot', text: res.messageText || res.message || 'No response', time: new Date() });
        this.inputDisabled = false;
        this.shouldScrollToBottom = true;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.messages.push({ sender: 'bot', text: 'Sorry, I encountered an error. Please try again.', time: new Date() });
        this.inputDisabled = false;
        this.shouldScrollToBottom = true;
        this.cdr.detectChanges();
      }
    });
  }
}
