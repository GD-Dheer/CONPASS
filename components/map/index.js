/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import MapView, { Polygon, PROVIDER_GOOGLE } from 'react-native-maps';
import buildings from '../../assets/polygons/polygons';
import styles from './styles';

export default class TheMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude: 45.492409,
        longitude: -73.582153
      },
    };
  }

  // componentDidMount() {
  //   const { description } = this.props.updatedRegion;
  //   this.setState({ region: description });
  // }

  render() {
    return (
      // Map view of the application, google maps as a provider
      <MapView
        provider={PROVIDER_GOOGLE}
        region={this.props.updatedRegion}
        style={styles.mapStyle}
      >
        {/* Mapping polygons to the MapView*/}
        {buildings.map((building) => {
          return (
            building.polygons.map((polygon) => {
              return (
                <CustomPolygon
                  key={polygon.name}
                  coordinates={polygon.coordinates}
                  fillColor="rgba(255,135,135,0.5)"
                />
              );
            })
          );
        })}
      </MapView>
    );
  }
}

function CustomPolygon({ onLayout, ...props }) {
  const ref = React.useRef();

  function onLayoutPolygon() {
    if (ref.current) {
      ref.current.setNativeProps({ fillColor: props.fillColor });
    }
    // call onLayout() from the props if you need it
  }

  return <Polygon ref={ref} onLayout={onLayoutPolygon} {...props} />;
}
