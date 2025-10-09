import { Signal, WritableSignal, computed, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Maybe } from '../types';

/**
 * Base interface for all state objects
 */
export interface BaseState {
  loading: boolean;
  error: Maybe<string>;
  lastUpdated: Maybe<number>;
  meta?: Record<string, any>;
}

/**
 * Base interface for paginated lists
 */
export interface PaginatedState<T = any> extends BaseState {
  items: T[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * Base interface for entity states (CRUD operations)
 */
export interface EntityState<T = any> extends BaseState {
  entities: Record<string | number, T>;
  selectedId: Maybe<string | number>;
  ids: (string | number)[];
}

/**
 * Loading states for different operations
 */
export interface LoadingState {
  loading: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  fetching: boolean;
}

/**
 * Generic action interface
 */
export interface Action<T = any> {
  type: string;
  payload?: T;
  meta?: Record<string, any>;
}

/**
 * State change event
 */
export interface StateChange<T = any> {
  previousState: T;
  currentState: T;
  action: Action;
  timestamp: number;
}

/**
 * Base store class with common functionality
 */
export abstract class BaseStore<T extends BaseState> {
  protected readonly _state: WritableSignal<T>;
  protected readonly _stateSubject: BehaviorSubject<T>;

  // Public readonly signals
  readonly state: Signal<T>;
  readonly loading: Signal<boolean>;
  readonly error: Signal<Maybe<string>>;
  readonly lastUpdated: Signal<Maybe<number>>;

  // Observable for RxJS compatibility
  readonly state$: Observable<T>;

  constructor(initialState: T) {
    this._state = signal(initialState);
    this._stateSubject = new BehaviorSubject(initialState);

    // Create computed signals
    this.state = this._state.asReadonly();
    this.loading = computed(() => this._state().loading);
    this.error = computed(() => this._state().error);
    this.lastUpdated = computed(() => this._state().lastUpdated);

    // Observable for RxJS compatibility
    this.state$ = this._stateSubject.asObservable();
  }

  /**
   * Update the entire state
   */
  protected setState(newState: T): void {
    this._state.set(newState);
    this._stateSubject.next(newState);
  }

  /**
   * Partially update the state
   */
  protected patchState(partialState: Partial<T>): void {
    const currentState = this._state();
    const newState = {
      ...currentState,
      ...partialState,
      lastUpdated: Date.now(),
    };
    this.setState(newState);
  }

  /**
   * Set loading state
   */
  protected setLoading(loading: boolean, error: Maybe<string> = null): void {
    this.patchState({
      loading,
      error,
    } as Partial<T>);
  }

  /**
   * Set error state
   */
  protected setError(error: string): void {
    this.patchState({
      loading: false,
      error,
    } as Partial<T>);
  }

  /**
   * Clear error state
   */
  protected clearError(): void {
    this.patchState({
      error: null,
    } as Partial<T>);
  }

  /**
   * Reset state to initial values
   */
  abstract reset(): void;

  /**
   * Get current state snapshot
   */
  getCurrentState(): T {
    return this._state();
  }
}

/**
 * Entity store with CRUD operations
 */
export abstract class EntityStore<
  T,
  TState extends EntityState<T> = EntityState<T>,
> extends BaseStore<TState> {
  // Computed selectors
  readonly entities = computed(() => this._state().entities);
  readonly selectedId = computed(() => this._state().selectedId);
  readonly ids = computed(() => this._state().ids);
  readonly selectedEntity = computed(() => {
    const state = this._state();
    return state.selectedId ? state.entities[state.selectedId] : null;
  });
  readonly entitiesArray = computed(() => {
    const state = this._state();
    return state.ids.map((id) => state.entities[id]).filter(Boolean);
  });

  /**
   * Add or update entities
   */
  protected upsertEntities(entities: T[], getId: (entity: T) => string | number): void {
    const currentState = this._state();
    const newEntities = { ...currentState.entities };
    const newIds = [...currentState.ids];

    entities.forEach((entity) => {
      const id = getId(entity);
      newEntities[id] = entity;
      if (!newIds.includes(id)) {
        newIds.push(id);
      }
    });

    this.patchState({
      entities: newEntities,
      ids: newIds,
    } as Partial<TState>);
  }

  /**
   * Remove entity
   */
  protected removeEntity(id: string | number): void {
    const currentState = this._state();
    const newEntities = { ...currentState.entities };
    const newIds = currentState.ids.filter((entityId) => entityId !== id);

    delete newEntities[id];

    this.patchState({
      entities: newEntities,
      ids: newIds,
      selectedId: currentState.selectedId === id ? null : currentState.selectedId,
    } as Partial<TState>);
  }

  /**
   * Select entity
   */
  selectEntity(id: Maybe<string | number>): void {
    this.patchState({
      selectedId: id,
    } as Partial<TState>);
  }

  /**
   * Clear all entities
   */
  protected clearEntities(): void {
    this.patchState({
      entities: {},
      ids: [],
      selectedId: null,
    } as unknown as Partial<TState>);
  }
}

/**
 * Paginated store for lists with pagination
 */
export abstract class PaginatedStore<
  T,
  TState extends PaginatedState<T> = PaginatedState<T>,
> extends BaseStore<TState> {
  // Computed selectors
  readonly items = computed(() => this._state().items);
  readonly totalCount = computed(() => this._state().totalCount);
  readonly currentPage = computed(() => this._state().currentPage);
  readonly pageSize = computed(() => this._state().pageSize);
  readonly hasMore = computed(() => this._state().hasMore);
  readonly totalPages = computed(() => {
    const state = this._state();
    return Math.ceil(state.totalCount / state.pageSize);
  });

  /**
   * Set items for current page
   */
  protected setItems(items: T[], totalCount: number, currentPage: number): void {
    const state = this._state();
    this.patchState({
      items,
      totalCount,
      currentPage,
      hasMore: currentPage * state.pageSize < totalCount,
      loading: false,
      error: null,
    } as Partial<TState>);
  }

  /**
   * Append items (for infinite scroll)
   */
  protected appendItems(items: T[], totalCount: number): void {
    const state = this._state();
    const allItems = [...state.items, ...items];
    const newPage = state.currentPage + 1;

    this.patchState({
      items: allItems,
      totalCount,
      currentPage: newPage,
      hasMore: allItems.length < totalCount,
      loading: false,
      error: null,
    } as Partial<TState>);
  }

  /**
   * Set page size
   */
  setPageSize(pageSize: number): void {
    this.patchState({
      pageSize,
      currentPage: 1,
    } as Partial<TState>);
  }

  /**
   * Go to page
   */
  setCurrentPage(page: number): void {
    this.patchState({
      currentPage: page,
    } as Partial<TState>);
  }
}
