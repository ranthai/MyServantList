export const defaultFilters = {
  rarity: [] as RarityFilters,
  class: [] as string[]
}

export interface ServantFilters {
  rarity: RarityFilters;
  class: ClassFilters;
}

export type RarityFilters = number[];
export type ClassFilters = string[];

export enum FilterType {
  Rarity,
  Class
}