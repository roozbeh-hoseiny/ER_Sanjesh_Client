export interface IPaginatedQuery<LastSeen = string> {
  lastSeen: LastSeen;
  pageSize: number;
}

export interface IPaginatedResponse<T, LastSeen = string> extends IPaginatedMetaResponse<LastSeen> {
  items: T[];
}

export interface IPaginatedMetaResponse<T = string> {
  lastSeen: T;
  totalCount: number;
}
