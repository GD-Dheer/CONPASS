import { FROM_INTERIOR, FROM_EXTERIOR, END_NAVIGATION } from './actionTypes';

export const fromInteriorNavigationStart = (itinerary) => {
  return { type: FROM_INTERIOR, itinerary };
};

export const fromExteriorNavigationStart = (itinerary) => {
  return { type: FROM_EXTERIOR, itinerary };
};

export const endNavigation = () => {
  return { type: END_NAVIGATION };
};
