import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class ToastService {
    constructor(private messageService: MessageService) { }

    showSuccess(detail: string, summary = 'Success') {
        this.messageService.add({ severity: 'success', summary, detail, life: 5000 });
    }

    showInfo(detail: string, summary = 'Info') {
        this.messageService.add({ severity: 'info', summary, detail, life: 5000 });
    }

    showWarn(detail: string, summary = 'Warning') {
        this.messageService.add({ severity: 'warn', summary, detail, life: 5000 });
    }

    showError(detail: string, summary = 'Error') {
        console.log('Showing error toast:', { summary, detail });
        this.messageService.add({ severity: 'error', summary, detail, life: 5000 });
    }
}