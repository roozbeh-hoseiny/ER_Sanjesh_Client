export interface IPaginatedQuery<LastSeen = string> {
  lastSeen: LastSeen;
  pageSize: number;
}

export interface IPaginatedResponse<T, LastSeen = string> {
  lastSeen: LastSeen;
  totalCount: number;
  items: T[];
}
