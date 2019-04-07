
export default interface ServantData {
  id: number;
  servant_icon_url: string;
  rarity: number;
  class: string;
  class_icon_url: string;
  english_name: string;
  japanese_name: string;
  category?: Category;

  servant_portrait_one_url: string;
  servant_portrait_two_url?: string;
  servant_portrait_three_url?: string;
  servant_portrait_four_url?: string;
  ascensions?: Ascensions;
  skill_reinforcements?: SkillReinforcements;
}

export interface ServantFilters {
  class_filters: string[]
}

export enum Category {
  UnlockableServants = 'Unlockable Servants',
  EventServants = 'Event Servants',
  FriendPoints = 'Friend Points',
  LimitedServants = 'Limited Servants',
  EnemyServants = 'Enemy Servants'
}

export function isItemCount(requirement: ItemCount | Condition) {
  return (requirement as ItemCount).count !== undefined
}

export type Requirement = ItemCount | Condition;

export interface Ascensions {
  [level: string]: [Requirement] ;
}

export interface SkillReinforcements {
  [level: string]: [ItemCount] ;
}

export interface ItemCount {
  name: string;
  url: string;
  count: string;
}

export interface Condition {
  condition: string;
}