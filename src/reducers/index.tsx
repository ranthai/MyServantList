import * as fromServants from './Servant';
import { combineReducers } from 'redux';

export interface State {
  servants: fromServants.State
}

export const initialState: State = {
  servants: fromServants.initialState
}

export const reducer = combineReducers<State>({
  servants: fromServants.reducer
})