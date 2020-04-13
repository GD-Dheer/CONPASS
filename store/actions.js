import {
  FROM_INTERIOR, FROM_EXTERIOR, END_NAVIGATION, SEND_END_DESTINATION
} from './actionTypes';

export const fromInteriorNavigationStart = (itinerary) => {
  return { type: FROM_INTERIOR, itinerary };
};

export const fromExteriorNavigationStart = (itinerary) => {
  return { type: FROM_EXTERIOR, itinerary };
};

export const endNavigation = () => {
  return { type: END_NAVIGATION };
};

export const sendEndDestination = (destination) => {
  return { type: SEND_END_DESTINATION, destination };
};
