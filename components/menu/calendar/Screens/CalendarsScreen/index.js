import React, { Component } from 'react';
import { View, AsyncStorage, ActivityIndicator } from 'react-native';
import CheckboxGroup from './CheckboxGroup';

export default class CalendarsScreen extends Component {
  constructor(props) {
    super(props);
    this.state={
      calendarsGeneralInfo :  [],
    };
    //this.getDatta=this.getDatta.bind(this);
  }

  componentDidMount() {
        console.log('length:');
    console.log(this.state.calendarsGeneralInfo.length);
    this.getDatta();
    if (this.state.calendarsGeneralInfo.length == 0) {
      console.log('am here');
       this.forceUpdate();
    }
  }


  getDatta() {
    if (this.props.navigation.state.params) {
      this.setState({ calendarsGeneralInfo: this.props.navigation.state.params.userCalendarsInfo },
        () => { this.forceUpdate(); });
      this.forceUpdate();
      return (
        <View>
          <CheckboxGroup options={this.state.calendarsGeneralInfo} />
        </View>
      );
    }
  }


  render() {
    console.log('in render');
    console.log(this.state.calendarsGeneralInfo);

    return (
      <View>
       <CheckboxGroup options={this.state.calendarsGeneralInfo} />
      </View>
    );
  }
}