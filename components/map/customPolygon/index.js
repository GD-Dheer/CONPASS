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

  componentDidUpdate(prevProps) {
    const { itinerary, building } = this.props;
    if (prevProps.itinerary !== itinerary) {
      if (itinerary.end) {
        if (itinerary.end.type === 'BUILDING' && itinerary.end.building.buildingName === building.buildingName) {
          this.setState({ isEndBuilding: true });
        } else {
          this.setState({ isEndBuilding: false });
        }
      } else {
        this.setState({ isEndBuilding: false });
      }
    }
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

const mapStateToProps = (state) => {
  return {
    itinerary: state.itinerary,
  };
};


export default connect(mapStateToProps)(CustomPolygon);
