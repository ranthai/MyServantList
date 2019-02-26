import { State } from '../reducers';
import { createSelector } from 'reselect'

const getServantsState = ((state: State) => state.servants)

export const getServants = createSelector([getServantsState], servants => servants.servants)