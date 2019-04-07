export interface ServantFilters {
  rarity: number[];
  class: string[];
}

export enum FilterType {
  Rarity,
  Class
}