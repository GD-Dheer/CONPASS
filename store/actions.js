import { GO_INT, GO_EXT } from './actionTypes';

export const goIntMode = (building) => {
  return { type: GO_INT, building };
};

export const goExtMode = (coordinates) => {
  return { type: GO_EXT, coordinates };
};
