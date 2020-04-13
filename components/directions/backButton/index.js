import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { connect } from 'react-redux';
import styles from './styles';
import { endNavigation } from '../../../store/actions';


class BackButton extends Component {
  /**
   * clears Redux navigation attributes and modifies UI to remove the search bars
   * from user view
   */
  back() {
    this.props.endNavigation();
    this.props.changeVisibilityTo(false);
    if (this.props.changePolylineVisibilityTo) {
      this.props.changePolylineVisibilityTo(false);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => {
          this.back();
        }}
        >
          <Entypo name="chevron-left" size={32} color="black" />
        </TouchableOpacity>
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    endNavigation: () => { dispatch(endNavigation()); },

  };
};


export default connect(null, mapDispatchToProps)(BackButton);
