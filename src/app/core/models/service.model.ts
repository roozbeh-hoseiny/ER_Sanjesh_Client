export interface IPaginatedQuery {
  lastSeen: string;
  pageSize: number;
}

export interface IPaginatedResponse<T> {
  lastSeen: string;
  totalCount: number;
  items: T[];
}
