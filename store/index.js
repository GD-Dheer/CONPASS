import { createStore } from 'redux';
import { FROM_EXTERIOR, FROM_INTERIOR, END_NAVIGATION } from './actionTypes';

// initial store state
const initialState = {
  start_mode: '',
  start_type: '',
  itinerary: '',
};

// Redux Reducer, this receives actions that are being DISPATCHED
const reducer = (state = initialState, action) => {
  if (action.type === FROM_EXTERIOR) {
    if (action.itinerary.start.type === 'POI') {
      return {
        ...state,
        start_mode: 'EXTERIOR',
        start_type: 'POI',
        itinerary: action.itinerary,
      };
    } if (action.itinerary.start.type === 'BUILDING') {
      return {
        ...state,
        start_mode: 'EXTERIOR',
        start_type: 'BUILDING',
        itinerary: action.itinerary,
      };
    }
  }

  if (action.type === FROM_INTERIOR) {
    return {
      ...state,
      start_mode: 'INTERIOR',
      start_type: 'BUILDING',
      itinerary: action.itinerary,
    };
  }

  if (action.type === END_NAVIGATION) {
    return {
      ...state,
      ...initialState
    };
  }

  return state;
};

const store = createStore(reducer);

export default store;
