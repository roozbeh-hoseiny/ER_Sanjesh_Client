export interface IStateResponse extends IRegionCommonProperties<ICity> {}

export interface ICity extends IRegionCommonProperties<IZone> {
  parentId: number;
}

export interface IZone extends IRegionCommonProperties<null> {
  id: number;
  title: string;
  parentId: number;
  regionType: number;
  cityCode?: string;
}

interface IRegionCommonProperties<T> {
  id: number;
  title: string;
  regionType: number;
  latitude: null;
  longitude: null;
  cityCode?: string;
  children?: [T];
}
