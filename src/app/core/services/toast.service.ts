import { Injectable } from '@angular/core';
import { MessageService, ToastMessageOptions } from 'primeng/api';

interface IToast extends Pick<ToastMessageOptions, 'sticky' | 'life'> {
  title?: string;
  text: string;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private messageService: MessageService) {}

  add(message: ToastMessageOptions) {
    if (!message.detail) return;
    this.messageService.add(message);
  }

  info(message: IToast) {
    const { title = 'اطلاع', text } = message;
    this.add({ ...message, summary: title, detail: text, severity: 'info' });
  }

  success(message: IToast) {
    const { title = 'موفقیت', text } = message;
    this.add({ ...message, summary: title, detail: text, severity: 'success' });
  }

  warn(message: IToast) {
    const { title = 'هشدار', text } = message;
    this.add({ ...message, summary: title, detail: text, severity: 'warn' });
  }

  error(message: IToast) {
    const { title = 'خطا', text } = message;
    this.add({ ...message, summary: title, detail: text, severity: 'error' });
  }

  notAccessLocal() {
    this.error({
      text: 'شما به این عملکرد دسترسی ندارید',
      title: 'خطا',
    });
  }
}
