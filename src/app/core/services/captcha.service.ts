import { timeToSeconds } from '@/utils';
import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal, Signal } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Maybe } from '../models';

interface ICaptchaResponse {
  id: string;
  expiry: string;
}

@Injectable({ providedIn: 'root' })
export class CaptchaService {
  // Signals for reactive consumption in components
  private _captchaId = signal<string | null>(null);
  readonly captchaId: Signal<string | null> = this._captchaId;

  private _loading = signal<boolean>(false);
  readonly loading: Signal<boolean> = this._loading;

  // default TTL 120 seconds
  private ttlSeconds = 120;
  private ttlTimerSub: Subscription | null = null;

  readonly captchaImageSrc = signal<Maybe<string>>(null);

  constructor(private http: HttpClient) {}

  readonly captchaIsExpired = computed(() => !this._captchaId());

  /** request a new captcha from backend and start TTL countdown */
  requestNewCaptcha(): void {
    const url = `/captcha/new`;
    this._loading.set(true);

    // Cancel any previous TTL timer
    this.clearTtlTimer();

    this.http
      .get<ICaptchaResponse>(url)
      .pipe(
        tap((res) => {
          if (!res) {
            throw new Error('Invalid captcha response');
          }
          this._captchaId.set(res.id);
          this.startTtlTimer(timeToSeconds(res.expiry));
          this.setCaptchaImageSrc();
        }),
        finalize(() => this._loading.set(false)),
      )
      .subscribe({
        next: () => {},
        error: (err) => {
          console.error('[CaptchaService] requestNewCaptcha error', err);
          this._captchaId.set(null);
        },
      });
  }

  /** Manually clear captcha and cancel TTL */
  clearCaptcha(): void {
    this._captchaId.set(null);
    this.clearTtlTimer();
  }

  setCaptchaImageSrc = () => {
    const id = this._captchaId();
    const base = environment.apiBaseUrl ? environment.apiBaseUrl.replace(/\/$/, '') : '';
    this.captchaImageSrc.set(id ? `${base}/captcha?Id=${encodeURIComponent(id)}` : '');
  };

  buildCaptchaHeaders(
    existing: Record<string, string> = {},
    captchaValue: string,
  ): Record<string, string> {
    const id = this._captchaId();
    if (!id) return { ...existing };
    return {
      ...existing,
      'x-CaptchaId': id,
      'x-CaptchaValue': captchaValue,
    };
  }

  /** internal TTL timer management */
  private startTtlTimer(seconds: number) {
    this.clearTtlTimer();
    this.ttlTimerSub = timer(seconds * 1000).subscribe(() => {
      this.requestNewCaptcha();
      this.ttlTimerSub = null;
    });
  }

  private clearTtlTimer() {
    if (this.ttlTimerSub) {
      this.ttlTimerSub.unsubscribe();
      this.ttlTimerSub = null;
    }
  }
}
