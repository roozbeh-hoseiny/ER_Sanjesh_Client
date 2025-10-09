import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BaseState, BaseStore } from '../base-store';

/**
 * Global application state
 */
export interface GlobalState extends BaseState {
  // UI State
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark';
  language: 'fa' | 'en';

  // App State
  isOnline: boolean;
  notifications: AppNotification[];
  breadcrumbs: Breadcrumb[];

  // User preferences
  preferences: UserPreferences;
}

/**
 * Application notification
 */
export interface AppNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  actions?: NotificationAction[];
}

/**
 * Notification action
 */
export interface NotificationAction {
  label: string;
  action: () => void;
  type?: 'primary' | 'default';
}

/**
 * Breadcrumb item
 */
export interface Breadcrumb {
  label: string;
  url?: string;
  icon?: string;
}

/**
 * User preferences
 */
export interface UserPreferences {
  dashboardLayout: 'grid' | 'list';
  itemsPerPage: number;
  autoSave: boolean;
  followSystemTheme: boolean;
  enableThemeTransitions: boolean;
  notifications: {
    email: boolean;
    push: boolean;
    sound: boolean;
  };
  accessibility: {
    highContrast: boolean;
    fontSize: 'small' | 'medium' | 'large';
    reducedMotion: boolean;
  };
}

/**
 * Global state store
 */
@Injectable({
  providedIn: 'root',
})
export class GlobalStore extends BaseStore<GlobalState> {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  constructor() {
    super({
      loading: false,
      error: null,
      lastUpdated: null,
      sidebarCollapsed: false,
      theme: 'light',
      language: 'fa',
      isOnline: navigator.onLine,
      notifications: [],
      breadcrumbs: [],
      preferences: {
        dashboardLayout: 'grid',
        itemsPerPage: 10,
        autoSave: true,
        followSystemTheme: false,
        enableThemeTransitions: true,
        notifications: {
          email: true,
          push: true,
          sound: false,
        },
        accessibility: {
          highContrast: false,
          fontSize: 'medium',
          reducedMotion: false,
        },
      },
    });

    this.initializeState();
  }

  // Computed selectors
  readonly sidebarCollapsed = this.computed((state) => state.sidebarCollapsed);
  readonly theme = this.computed((state) => state.theme);
  readonly language = this.computed((state) => state.language);
  readonly isOnline = this.computed((state) => state.isOnline);
  readonly notifications = this.computed((state) => state.notifications);
  readonly unreadNotifications = this.computed((state) =>
    state.notifications.filter((n) => !n.read)
  );
  readonly breadcrumbs = this.computed((state) => state.breadcrumbs);
  readonly preferences = this.computed((state) => state.preferences);

  /**
   * Initialize state from localStorage and browser events
   */
  private initializeState(): void {
    // Load preferences from localStorage
    const savedPreferences = localStorage.getItem('user_preferences');
    if (savedPreferences) {
      try {
        const preferences = JSON.parse(savedPreferences);
        this.patchState({ preferences });
      } catch (error) {
        console.error('Error loading user preferences:', error);
      }
    }

    // Load theme from localStorage
    const savedTheme = localStorage.getItem('app_theme') as 'light' | 'dark';
    if (savedTheme) {
      this.patchState({ theme: savedTheme });
    }

    // Load sidebar state from localStorage
    const sidebarCollapsed = localStorage.getItem('sidebar_collapsed') === 'true';
    this.patchState({ sidebarCollapsed });

    // Listen to online/offline events
    window.addEventListener('online', () => this.setOnlineStatus(true));
    window.addEventListener('offline', () => this.setOnlineStatus(false));
  }

  /**
   * Helper method to create computed signals
   */
  private computed<K>(selector: (state: GlobalState) => K) {
    return () => selector(this._state());
  }

  /**
   * Toggle sidebar collapse state
   */
  toggleSidebar(): void {
    const collapsed = !this._state().sidebarCollapsed;
    this.patchState({ sidebarCollapsed: collapsed });
    localStorage.setItem('sidebar_collapsed', collapsed.toString());
  }

  /**
   * Set sidebar collapse state
   */
  setSidebarCollapsed(collapsed: boolean): void {
    this.patchState({ sidebarCollapsed: collapsed });
    localStorage.setItem('sidebar_collapsed', collapsed.toString());
  }

  /**
   * Toggle theme
   */
  toggleTheme(): void {
    const theme = this._state().theme === 'light' ? 'dark' : 'light';
    this.setTheme(theme);
  }

  /**
   * Set theme
   */
  setTheme(theme: 'light' | 'dark'): void {
    this.patchState({ theme });
    localStorage.setItem('app_theme', theme);

    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
  }

  /**
   * Set language
   */
  setLanguage(language: 'fa' | 'en'): void {
    this.patchState({ language });
    localStorage.setItem('app_language', language);
  }

  /**
   * Set online status
   */
  setOnlineStatus(isOnline: boolean): void {
    this.patchState({ isOnline });

    if (isOnline) {
      this.addNotification({
        type: 'success',
        title: 'اتصال برقرار شد',
        message: 'اتصال اینترنت برقرار شد',
      });
    } else {
      this.addNotification({
        type: 'warning',
        title: 'قطع اتصال',
        message: 'اتصال اینترنت قطع شده است',
      });
    }
  }

  /**
   * Add notification
   */
  addNotification(notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>): void {
    const newNotification: AppNotification = {
      ...notification,
      id: this.generateId(),
      timestamp: Date.now(),
      read: false,
    };

    const notifications = [newNotification, ...this._state().notifications];
    this.patchState({ notifications });
  }

  /**
   * Mark notification as read
   */
  markNotificationRead(id: string): void {
    const notifications = this._state().notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    this.patchState({ notifications });
  }

  /**
   * Mark all notifications as read
   */
  markAllNotificationsRead(): void {
    const notifications = this._state().notifications.map((n) => ({ ...n, read: true }));
    this.patchState({ notifications });
  }

  /**
   * Remove notification
   */
  removeNotification(id: string): void {
    const notifications = this._state().notifications.filter((n) => n.id !== id);
    this.patchState({ notifications });
  }

  /**
   * Clear all notifications
   */
  clearNotifications(): void {
    this.patchState({ notifications: [] });
  }

  /**
   * Set breadcrumbs
   */
  setBreadcrumbs(breadcrumbs: Breadcrumb[]): void {
    this.patchState({ breadcrumbs });
  }

  /**
   * Update user preferences
   */
  updatePreferences(preferences: Partial<UserPreferences>): void {
    const currentPreferences = this._state().preferences;
    const newPreferences = { ...currentPreferences, ...preferences };

    this.patchState({ preferences: newPreferences });
    localStorage.setItem('user_preferences', JSON.stringify(newPreferences));
  }

  /**
   * Reset state to initial values
   */
  reset(): void {
    this.setState({
      loading: false,
      error: null,
      lastUpdated: null,
      sidebarCollapsed: false,
      theme: 'light',
      language: 'fa',
      isOnline: navigator.onLine,
      notifications: [],
      breadcrumbs: [],
      preferences: {
        dashboardLayout: 'grid',
        itemsPerPage: 10,
        autoSave: true,
        followSystemTheme: false,
        enableThemeTransitions: true,
        notifications: {
          email: true,
          push: true,
          sound: false,
        },
        accessibility: {
          highContrast: false,
          fontSize: 'medium',
          reducedMotion: false,
        },
      },
    });
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
