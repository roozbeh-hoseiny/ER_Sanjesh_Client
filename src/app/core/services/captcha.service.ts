import { timeToSeconds } from '@/utils';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  private _captchaId = signal<string | null>(null);
  readonly captchaId: Signal<string | null> = this._captchaId;

  private _loading = signal<boolean>(false);

  // default TTL 120 seconds
  private readonly _ttlSeconds = signal<number>(120);
  private ttlTimerSub: Subscription | null = null;

  private readonly _captchaImageSrc = signal<Maybe<string>>(null);

  constructor(private http: HttpClient) {}

  readonly captchaIsExpired = computed(() => !this._captchaId());
  readonly captchaImageSrc = computed(() => this._captchaImageSrc());
  readonly ttlSeconds = computed(() => this._ttlSeconds());
  readonly loading = computed(() => this._loading());

  /** request a new captcha from backend and start TTL countdown */
  requestNewCaptcha(): void {
    const url = `/captcha/new`;
    this.getCaptcha(url);
  }

  private getCaptcha(url: string, headers?: HttpHeaders): void {
    this._loading.set(true);

    // Cancel any previous TTL timer
    this.clearTtlTimer();

    this.http
      .get<ICaptchaResponse>(url, {
        headers,
      })
      .pipe(
        tap((res) => {
          if (!res) {
            throw new Error('Invalid captcha response');
          }
          this._captchaId.set(res.id);
          this._ttlSeconds.set(timeToSeconds(res.expiry));
          this.startTtlTimer();
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
    this._captchaImageSrc.set(
      id ? `${base}/captcha?Id=${encodeURIComponent(id)}&width=222&height=111` : '',
    );
  };

  renewCaptcha = () => {
    const url = `/captcha/new`;

    const headers = new HttpHeaders({ 'x-OldCaptchaId': this.captchaId()! });

    this.getCaptcha(url, headers);
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
  private startTtlTimer() {
    this.clearTtlTimer();
    this.ttlTimerSub = timer(this._ttlSeconds() * 1000).subscribe(() => {
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
