
export default interface ServantData {
  id: number;
  icon_url: string;
  class_url: string;
  english_name: string;
  japanese_name: string;
  category?: Category;

  stage_one_url: string;
  stage_two_url?: string;
  stage_three_url?: string;
  stage_four_url?: string;
  ascensions?: Ascensions;
  skill_reinforcements?: SkillReinforcements;
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