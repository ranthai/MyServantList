
import logger from 'redux-logger';
import { createStore, applyMiddleware } from "redux";
import { State, reducer } from "../reducers";

// todo fix types
const Store = createStore<State, any, any, any>(reducer, applyMiddleware(logger));
export default Store;