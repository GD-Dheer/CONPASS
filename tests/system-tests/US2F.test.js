import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ShuttleSchedule from '../../components/home/menu/shuttleBusSchedule';

Enzyme.configure({ adapter: new Adapter() })

it('System Test: US2F', () => {
  const wrapper = mount(<ShuttleSchedule />)
  //const sgwCampusData = wrapper.children(React.ScrollView).children(React.SectionList).sections;
});

