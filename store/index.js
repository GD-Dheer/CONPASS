import { createStore } from 'redux';
import { GO_INT, GO_EXT } from './actionTypes';

// initial store state
const initialState = {
  redux_env_mode: 'ext',
  building: {},
};

// Redux Reducer, this receives actions that are being DISPATCHED
const reducer = (state = initialState, action) => {
  console.log('store trig');
  if (action.type === GO_INT) {
    // handle logic here if its a building with class or a simple POI
    return {
      ...state,
      redux_env_mode: 'int',
      itinerary: action.itinerary,
    };
  }

  if (action.type === GO_EXT) {
    return {
      ...state,
      redux_env_mode: 'ext'
    };
  }
  return state;
};

const store = createStore(reducer);

export default store;
