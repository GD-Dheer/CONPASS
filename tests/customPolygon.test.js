import React from 'react';
import { shallow } from 'enzyme';
import { configureStore } from 'redux-mock-store';
import CustomPolygon from '../components/map/customPolygon';
import buildings from '../assets/polygons/polygons';

jest.unmock('redux-mock-store');

const building = buildings[0];
const mockStore = configureStore([]);
const store = mockStore({
  myState: 'sample text',
});

it('It should build custom polygon when given a building', async () => {
  const focusOnBuilding = jest.fn();
  // const spyZoomBuilding = jest.spyOn(wrapper.instance(), 'fitScreenToPath');
  const wrapper = shallow(<CustomPolygon store={store} focusOnBuilding={focusOnBuilding} building={building} />);
  wrapper.instance().zoomBuilding();
  expect(wrapper.instance().props.focusOnBuilding).toBeCalled();
});
