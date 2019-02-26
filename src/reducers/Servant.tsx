import { ActionTypes, Action } from "../actions/Servant";
import Servant from "../models/Servant";

export interface State {
  servants: Servant[]
}

export const initialState: State = {
  servants: []
}

export function reducer(state: State = initialState, action: Action) {
  switch (action.type) {
    case ActionTypes.ADD_SERVANTS: {
      const state_servants = state.servants;
      const servants = action.payload.servants;

      if (state_servants.length < servants.length) {
        return {
          ...state,
          servants: [...servants]
        }
      }
      else {
        return state;
      }
    }

    default:
      return state;
  }
}