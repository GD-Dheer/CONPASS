import React, { Component } from 'react';
import { Polygon } from 'react-native-maps';
import { connect } from 'react-redux';

class CustomPolygon extends Component {
  /**
   * function focuses on building when selected on map
   */
  zoomBuilding() {
    const { building, itinerary } = this.props;
    
    if(building.building ===itinerary.buildingEnd.building) {
      console.log('right building end');
    }
    this.props.focusOnBuilding(building);
  }

  render() {
    const { building } = this.props;
    return (
      <Polygon
        coordinates={building.polygon.coordinates}
        strokeColor="rgba(0, 0, 0, 1)"
        strokeWidth={3}
        tappable
        onPress={() => {
          this.zoomBuilding();
        }}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    itinerary: state.itinerary
  };
};



export default connect(mapStateToProps)(CustomPolygon);
