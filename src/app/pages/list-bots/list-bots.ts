import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { ChatUi } from '../chat-ui/chat-ui';
import { DatePipe, NgClass } from '@angular/common';
import { ChatBot, ApiKeyList, ApiKeyResponse, BaseResponse, ApiKey } from '../../model/todos.type';
import { ToastService } from '../../api/toastService/toast.service';
import { ApiService } from '../../api/apiCall';

@Component({
  selector: 'app-list-bots',
  imports: [DatePipe, NgClass, ChatUi],
  templateUrl: './list-bots.html',
  styleUrl: './list-bots.css',
})
export class ListBots {
  @Input() chatBotList!: ChatBot[];
  @Input() addBot!: boolean;
  @Input() botsLoading!: boolean;
  @Output() toggleAddBot = new EventEmitter<void>();

  openDropdownId: number | null = null;
  viewApiBotId: number | null = null;
  viewChatBotId: number | null = null;

  // Dummy data for rendering the UI. This should be populated by an API call when viewApiBotId changes.
  apiKeys: ApiKeyList | null = null;

  constructor(
    private apiService: ApiService,
    private toast: ToastService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
  }

  getApiKeys(id: number) {
    this.apiService.getApiKey(id).subscribe({
      next: (res: ApiKeyResponse) => {
        this.apiKeys = res.apiKeyList;
        // this.toast.showSuccess(res.message);
        console.log(this.apiKeys, res);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  changeStatus(id: number, status: boolean, chatbotId: number) {
    this.apiService.changeStatus(id, status).subscribe({
      next: (res: BaseResponse) => {
        this.toast.showSuccess(res.message);
        this.getApiKeys(chatbotId);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  copyApiKey(apiKey: string) {
    navigator.clipboard.writeText(apiKey).then(() => {
      this.toast.showSuccess('API Key copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy', err);
      this.toast.showError('Failed to copy API Key');
    });
  }

  createApiKey(chatBotId: number) {
    this.apiService.createApiKey(chatBotId).subscribe({
      next: (res: BaseResponse) => {
        this.toast.showSuccess(res.message);
        this.getApiKeys(chatBotId);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  deleteApiKey(keyId: number, botId: number) {
    this.apiService.deleteApiKey(keyId).subscribe({
      next: (res: BaseResponse) => {
        this.toast.showSuccess(res.message || 'API Key deleted successfully');
        this.getApiKeys(botId);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  toggleDropdown(botId: number) {
    if (this.openDropdownId === botId) {
      this.openDropdownId = null;
    } else {
      this.openDropdownId = botId;
    }
  }

  toggleApiKeyVisibility(key: any) {
    if (key.visible) {
      key.visible = false;
      if (key.maskedKey) {
        key.apiKey = key.maskedKey;
      }
      if (key.timeoutId) {
        clearTimeout(key.timeoutId);
        key.timeoutId = null;
      }
    } else {
      this.apiService.getKeys(key.id).subscribe({
        next: (res: ApiKey) => {
          if (!key.maskedKey) {
            key.maskedKey = key.apiKey; // Save the original masked key
          }
          key.apiKey = res.apiKey;
          key.visible = true;
          this.cdr.detectChanges();

          // Auto-hide and re-mask after 10 seconds
          if (key.timeoutId) {
            clearTimeout(key.timeoutId);
          }
          key.timeoutId = setTimeout(() => {
            key.visible = false;
            if (key.maskedKey) {
              key.apiKey = key.maskedKey;
            }
            this.cdr.detectChanges();
          }, 10000);
        },
        error: (err) => {
          console.error(err);
        }
      });
    }
  }

  viewChatBot(id: number) {
    this.viewChatBotId = id;
  }

  toggleViewApi(botId: number) {
    if (this.viewApiBotId === botId) {
      this.viewApiBotId = null;
    } else {
      this.viewApiBotId = botId;
      this.getApiKeys(botId);
      // Close dropdown when opening API view
      this.openDropdownId = null;
    }
  }

  getBotStatus(chunkedData: string | number): string {
    const val = Number(chunkedData);
    switch (val) {
      case 1:
        return "Processing";
      case 2:
        return "Completed";
      case 0:
        return "Pending";
      default:
        return "Unknown";
    }
  }

  getBotStatusClass(chunkedData: string | number): string {
    const val = Number(chunkedData);
    switch (val) {
      case 1:
        // Processing: Blue theme
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20";
      case 2:
        // Completed: Green theme
        return "bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20";
      case 0:
        // Pending: Yellow/Orange theme
        return "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-neutral-800 dark:text-gray-300 dark:border-neutral-700";
    }
  }

  getBotStatusDotClass(chunkedData: string | number): string {
    const val = Number(chunkedData);
    switch (val) {
      case 1: return "bg-blue-500 dark:bg-blue-400 animate-pulse";
      case 2: return "bg-green-500 dark:bg-green-400";
      case 0: return "bg-yellow-500 dark:bg-yellow-400";
      default: return "bg-gray-500 dark:bg-gray-400";
    }
  }
}
