// Base store classes and utilities
export * from './base-store';

// Global state management
export * from './global/global.store';

// State effects and utilities
export * from './state-effects.service';

// State management interfaces
export type {
  Action,
  BaseState,
  EntityState,
  LoadingState,
  PaginatedState,
  StateChange,
} from './base-store';

export type {
  AppNotification,
  Breadcrumb,
  GlobalState,
  NotificationAction,
  UserPreferences,
} from './global/global.store';
