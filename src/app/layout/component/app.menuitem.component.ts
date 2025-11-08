import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { LayoutService } from '../service/layout.service';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[app-menuitem]',
  imports: [CommonModule, RouterModule, RippleModule],
  templateUrl: './app.menuitem.component.html',
  animations: [
    trigger('children', [
      state(
        'collapsed',
        style({
          height: '0',
        }),
      ),
      state(
        'expanded',
        style({
          height: '*',
        }),
      ),
      transition('collapsed <=> expanded', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
    ]),
  ],
  providers: [LayoutService],
})
export class AppMenuitem {
  @Input() item!: MenuItem;

  @Input() index!: number;

  @Input() @HostBinding('class.layout-root-menuitem') root!: boolean;

  @Input() parentKey!: string;

  active = false;

  menuSourceSubscription: Subscription;

  menuResetSubscription: Subscription;

  key: string = '';

  constructor(
    public router: Router,
    private layoutService: LayoutService,
  ) {
    this.menuSourceSubscription = this.layoutService.menuSource$.subscribe((value) => {
      Promise.resolve(null).then(() => {
        if (value.routeEvent) {
          this.active =
            value.key === this.key || value.key.startsWith(this.key + '-') ? true : false;
        } else {
          if (value.key !== this.key && !value.key.startsWith(this.key + '-')) {
            this.active = false;
          }
        }
      });
    });

    this.menuResetSubscription = this.layoutService.resetSource$.subscribe(() => {
      this.active = false;
    });

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      // always update active state on navigation so parent items can
      // detect if any descendant route is active
      this.updateActiveStateFromRoute();
    });
  }

  ngOnInit() {
    this.key = this.parentKey ? this.parentKey + '-' + this.index : String(this.index);

    if (this.item.routerLink) {
      this.updateActiveStateFromRoute();
    }
  }

  updateActiveStateFromRoute() {
    const opts = {
      paths: 'subset' as any,
      queryParams: 'ignored' as any,
      matrixParams: 'subset' as any,
      fragment: 'ignored' as any,
    };

    let activeRoute = false;

    if (this.item.routerLink) {
      activeRoute = this.router.isActive(this.item.routerLink[0], opts);
    }

    // if this item itself is not active, check its descendants
    if (!activeRoute && this.item.items && this.item.items.length) {
      const anyChildActive = (items: MenuItem[]): boolean => {
        for (const it of items) {
          if (it.routerLink && this.router.isActive(it.routerLink[0], opts)) {
            return true;
          }
          if (it.items && it.items.length && anyChildActive(it.items)) {
            return true;
          }
        }
        return false;
      };

      activeRoute = anyChildActive(this.item.items);
    }

    if (activeRoute) {
      // notify layout that this menu (or its descendant) is active
      this.layoutService.onMenuStateChange({ key: this.key, routeEvent: true });
    }
  }

  itemClick(event: Event) {
    // avoid processing disabled items
    if (this.item.disabled) {
      event.preventDefault();
      return;
    }

    // execute command
    if (this.item.command) {
      this.item.command({ originalEvent: event, item: this.item });
    }

    // toggle active state
    if (this.item.items) {
      this.active = !this.active;
    }

    this.layoutService.onMenuStateChange({ key: this.key });
  }

  get submenuAnimation() {
    return this.root ? 'expanded' : this.active ? 'expanded' : 'collapsed';
  }

  @HostBinding('class.active-menuitem')
  get activeClass() {
    // mark item as active when itself or any of its submenu items are active
    // include root items as well so parents highlight when a child route is active
    return this.active;
  }

  ngOnDestroy() {
    if (this.menuSourceSubscription) {
      this.menuSourceSubscription.unsubscribe();
    }

    if (this.menuResetSubscription) {
      this.menuResetSubscription.unsubscribe();
    }
  }
}
