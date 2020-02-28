import React, { Component } from 'react';
import {
  View, Keyboard, TouchableOpacity, Text
} from 'react-native';
import { SearchBar } from 'react-native-elements';
import styles from './styles';

export default class searchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPredictions: true,
      destination: '',
      predictions: [],
      locations: '',
      region: {
        latitude: 45.492409,
        longitude: -73.582153,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      }
    };
  }

  // Function: When entering text searchbar, captures all the possible predictions from google's api
  // Parameter: Text input from search bar

  async onChangeDestination(destination) {
    this.setState({ destination });
    const key = 'AIzaSyCqNODizSqMIWbKbO8Iq3VWdBcK846n_3w';
    const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${key}&input=${destination}&location=45.492409, -73.582153&radius=2000`;
    try {
      const result = await fetch(apiUrl);
      const json = await result.json();
      this.setState({
        predictions: json.predictions
      });
    } catch (err) {
      console.error(err);
    }
  }

  // Function: gets the latitude and longitude of a chosen prediction
  // Parameter: place_id of the chosen prediction

  async getLatLong(prediction) {
    // eslint-disable-next-line react/no-unused-state
    this.setState({ description: prediction });
    const key = 'AIzaSyCqNODizSqMIWbKbO8Iq3VWdBcK846n_3w';
    const geoUrl = `https://maps.googleapis.com/maps/api/place/details/json?key=${key}&placeid=${prediction}`;
    const { locations } = this.state;

    try {
      const georesult = await fetch(geoUrl);
      const gjson = await georesult.json();
      this.setState({ locations: gjson.result.geometry.location });

      this.setState({
        region: {
          latitude: locations.lat,
          longitude: locations.lng,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05
        }

      });
      this.props.callBack(this.state.region);
    } catch (err) {
      console.error(err);
    }
  }


  render() {
    // Predictions mapped and formmated from the current state predictions
    const predictions = this.state.predictions.map((prediction) => {
      return (
        <View key={prediction.id} style={styles.view}>
          <TouchableOpacity
            style={styles.Touch}
            onPress={() => {
              this.setState({ destination: prediction.description });
              this.getLatLong(prediction.place_id);
              this.setState({ showPredictions: false });
              Keyboard.dismiss();
            }}
          >
            <Text key={prediction.id}>{prediction.description}</Text>
          </TouchableOpacity>

        </View>
      );
    });

    return (

      // Search bar element
      <View style={styles.container}>
        <View>
          <SearchBar
            lightTheme
            placeholder="Search..."
            onChangeText={(destination) => { return this.onChangeDestination(destination); }}
            value={this.state.destination}
            style={styles.SearchBar}
            onClear={() => { this.setState({ showPredictions: true }); }}
          />
        </View>
        {
          // Show predictions if there is a valid prediction from the current input
          this.state.showPredictions
            ? predictions : null
        }
      </View>
    );
  }
}
