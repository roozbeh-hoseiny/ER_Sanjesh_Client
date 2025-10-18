export interface defaultStoreState<T> {
  loading: boolean;
  error: string | null;
  items: T;
}
