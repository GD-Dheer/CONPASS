import React, { Component } from 'react';
import { View, AsyncStorage, ActivityIndicator } from 'react-native';

export default class FetchScreen extends Component {
  constructor(props){
    super(props);
  }
  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    //getting user calendars general info
    const stringUserCalendarsGeneralInfo = await AsyncStorage.getItem('stringUserCalendarsGeneralInfo');
    const userCalendarsGeneralInfo = JSON.parse(stringUserCalendarsGeneralInfo);

    /*
    console.log('String userCalendarGeneralInfo: ', stringUserCalendarsGeneralInfo);
console.log('array userCalendarGeneralInfo: ', userCalendarsGeneralInfo );
*/

    const evnts = await AsyncStorage.getItem('events');
    const events = JSON.parse(evnts);
    this.props.navigation.navigate('DashboardScreen', { events });
  }

  render() {
    return (
      <View>
        <ActivityIndicator size="large" />
      </View>
    );
  }
}
