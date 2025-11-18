import { Directive, ElementRef, Renderer2 } from '@angular/core';

/**
 * Prevent aggressive content-scripts and autofill engines from inspecting
 * or modifying inputs by setting common attributes that signal disabled
 * editing/grammar/autocomplete features.
 */
@Directive({ selector: '[appBlockContentScripts]', standalone: true })
export class BlockContentScriptsDirective {
  constructor(
    private el: ElementRef<HTMLElement>,
    private r: Renderer2,
  ) {
    const attrs: Record<string, string> = {
      autocomplete: 'off',
      spellcheck: 'false',
      'data-gramm': 'false',
      'data-gramm_editor': 'false',
      autocorrect: 'off',
      autocapitalize: 'off',
      'aria-autocomplete': 'none',
    };

    Object.entries(attrs).forEach(([k, v]) => this.r.setAttribute(this.el.nativeElement, k, v));
  }
}
