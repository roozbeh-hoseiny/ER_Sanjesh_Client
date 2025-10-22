export interface IStateResponse {
  id: number;
  parentId: number;
  title: string;
  regionType: number;
  latitude: null;
  longitude: null;
  children: ICity[];
}

export interface ICity {
  id: number;
  title: string;
  parentId: number;
  regionType: number;
}
