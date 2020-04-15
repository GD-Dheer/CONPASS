import { createStore } from 'redux';
import {
  SET_END_BUILDING_NODE, RESET_NAVIGATION, SET_START_BUILDING_NODE, SET_FROM_WITHIN_BUILDING_NODE
} from './actionTypes';

// initial store state
const initialState = {
  endBuildingNode: '',
  startBuildingNode: '',
  navType: '',
};

const reducer = (state = initialState, action) => {
  if (action.type === SET_END_BUILDING_NODE) {
    console.log(SET_END_BUILDING_NODE);
    return {
      ...state,
      endBuildingNode: action.endBuildingNode,
      navType: 'POI_TO_BUILDING'
    };
  }

  if (action.type === SET_START_BUILDING_NODE) {
    return {
      ...state,
      startBuildingNode: action.startBuildingNode,
    };
  }

  if (action.type === SET_FROM_WITHIN_BUILDING_NODE) {
    console.log(SET_FROM_WITHIN_BUILDING_NODE);
    return {
      ...state,
      fromWithinBuildingNode: action.fromWithinBuildingNode,
    };
  }

  if (action.type === RESET_NAVIGATION) {
    console.log(RESET_NAVIGATION);
    return {
      ...state,
      endBuildingNode: '',
      startBuildingNode: '',
      fromWithinBuildingNode: '',
      navType: ''
    };
  }

  return state;
};

const store = createStore(reducer);

export default store;
