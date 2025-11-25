import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { PopoverModule } from 'primeng/popover';

@Component({
  selector: 'uikit-copy',
  standalone: true,
  imports: [CommonModule, PopoverModule],
  templateUrl: './copy.component.html',
})
export class UikitCopyComponent {
  @Input() text: string | null = null;
  @ViewChild('op') op: any;

  copied = false;

  async copy(event?: Event) {
    try {
      const payload = this.text ?? '';
      if (navigator && navigator.clipboard && payload !== '') {
        await navigator.clipboard.writeText(payload);
        this.showCopiedTooltip(event);
      }
    } catch (err) {
      // fallback: try execCommand (older browsers) or ignore
      try {
        const textarea = document.createElement('textarea');
        textarea.value = this.text ?? '';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        this.showCopiedTooltip(event);
      } catch (e) {
        console.error('Copy failed', e);
      }
    }
  }

  private showCopiedTooltip(event?: Event) {
    this.copied = true;
    try {
      this.op?.show(event);
    } catch (e) {
      // ignore if popover not available
    }

    setTimeout(() => {
      try {
        this.op?.hide();
      } catch (_) {}
      this.copied = false;
    }, 1400);
  }
}
