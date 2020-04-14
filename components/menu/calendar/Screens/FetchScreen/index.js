import React, { Component } from 'react';
import { View, AsyncStorage, ActivityIndicator } from 'react-native';

export default class FetchScreen extends Component {
  constructor(props) {
    super(props);
    //this.getDatta=this.getDatta.bind(this);
  }

  componentDidMount() {
    this.getData();
  }


  getData = async () => {
    const evnts = await AsyncStorage.getItem('events');
    const events = JSON.parse(evnts);
   //this.props.navigation.navigate('DashboardScreen', { events });
  }


  render() {

    return (
      <View>
       <ActivityIndicator />
      </View>
    );
  }
}
