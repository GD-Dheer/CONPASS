import React from 'react';
import Enzyme, { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ShuttleSchedule from '../../components/home/menu/shuttleBusSchedule';
import SearchBar from '../../components/searchBar';

Enzyme.configure({ adapter: new Adapter() });

it('System Test: US2F', () => {
  const wrapper = mount(<ShuttleSchedule />);
  // const sgwCampusData = wrapper.children(React.ScrollView).children(React.SectionList).sections;
});

describe('SearchBar component', () => {
  it('should render correctly in "debug" mode', () => {
    const searchBarcomponent = shallow(<SearchBar debug />);
    expect(searchBarcomponent).toMatchSnapshot();
  });
});
