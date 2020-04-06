import { GO_INT, GO_EXT } from './actionTypes';

export const goIntMode = (itinerary) => {
  return { type: GO_INT, itinerary };
};

export const goExtMode = () => {
  return { type: GO_EXT };
};
