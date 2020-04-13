import React, { Component } from 'react';
import { Polygon } from 'react-native-maps';
import { connect } from 'react-redux';

class CustomPolygon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEndBuilding: false,
    };
  }

  /**
   * function focuses on building when selected on map
   */
  zoomBuilding() {
    const { building } = this.props;
    const { isEndBuilding } = this.state;

    if (isEndBuilding) {
      console.log('end, building. Trigger Dijkstra path builder in this function');
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

export default CustomPolygon;
