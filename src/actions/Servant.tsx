
import Servant from '../models/Servant';

export enum ActionTypes {
  ADD_SERVANTS = 'ADD_SERVANTS'
}

export interface AddServantsAction { type: ActionTypes.ADD_SERVANTS, payload: { servants: Servant[]} }

export function addServants(servants: Servant[]): AddServantsAction {
  return {
    type: ActionTypes.ADD_SERVANTS,
    payload: {
      servants: servants
    }
  }
}

export type Action = AddServantsAction