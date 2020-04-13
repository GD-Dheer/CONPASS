import React from 'react';
import { shallow } from 'enzyme';
import IndoorDirections from '../components/directions/indoorDirections';

it('Should cut the string of the building name if it is too long', () => {
  const turnInteriorModeOff = jest.fn();

  // length: 26, maximum allowed is 24
  const stringTooLong26 = '11111111111111111111111111';

  const indoorDirectionsComponent = shallow(<IndoorDirections
    building={stringTooLong26}
    turnInteriorModeOff={turnInteriorModeOff}
  />);

  const cutString24 = indoorDirectionsComponent.instance().limitNameLength(stringTooLong26);
  expect(cutString24.length).toBe(24);
});
