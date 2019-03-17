import { ItemContent } from "semantic-ui-react";

export default interface Servant {
  id: number;
  icon_url: string;
  class_url: string;
  english_name: string;
  japanese_name: string;
  category: string | null;

  stage_one_url: string;
  stage_two_url: string | null;
  stage_three_url: string | null;
  stage_four_url: string | null;
  ascensions: {
    [level: string]: [Requirement] ;
  } | null;
  skill_reinforcements: {
    [level: string]: [ItemCount] ;
  } | null;
}

export function isItemCount(requirement: ItemCount | Condition) {
  return (requirement as ItemCount).count !== undefined
}

export type Requirement = ItemCount | Condition;

export interface ItemCount {
  name: string;
  url: string;
  count: string;
}

export interface Condition {
  condition: string;
}