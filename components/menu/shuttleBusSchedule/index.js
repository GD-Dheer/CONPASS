import React, { Component } from 'react';
import {
  View, Text, ScrollView, SectionList
} from 'react-native';

import {
  Tab, Tabs, ListItem
} from 'native-base';
import shuttleScheduleInformation from './shuttleScheduleService';
import styles from './styles';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export default class ShuttleSchedule extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Tabs>
          <Tab heading="SGW">
            <Schedule selectedButtonIndex={0} />
          </Tab>
          <Tab heading="LOY">
            <Schedule selectedButtonIndex={1} />
          </Tab>
        </Tabs>

      </View>
    );
  }
}

const Schedule = (props) => {
  console.log(props);
  /** The function will return the appropriate schedule.
   * Button index is as follows: 0 -> SGW and 1->LOY
   * @param {Number} selectedButtonIndex - index of the button, either 0 or 1
   */
  function getShuttleCampusInformation(selectedButtonIndex) {
    if (DAYS[new Date().getDay()] === 'Saturday' || DAYS[new Date().getDay()] === 'Sunday') {
      return ['N/A'];
    }
    if (selectedButtonIndex === 1) {
      if (DAYS[new Date().getDay()] === 'Friday') {
        return shuttleScheduleInformation.Fri.LOY;
      }
      return shuttleScheduleInformation.Mon_Thu.LOY;
    }
    if (selectedButtonIndex === 0) {
      if (DAYS[new Date().getDay()] === 'Friday') {
        return shuttleScheduleInformation.Fri.SGW;
      }
      return shuttleScheduleInformation.Mon_Thu.SGW;
    }
    return ['N/A'];
  }
  return (
    <View>
      <ScrollView
        horizontal
        contentContainerStyle={{
          flexGrow: 1,
          width: '100%',
        }}
      >

        <SectionList
          sections={[
            {
              title: props.selectedButtonIndex === 0
                ? 'Sir George Williams Campus' : 'Loyola Campus',
              data: getShuttleCampusInformation(props.selectedButtonIndex)
            },
          ]}
          renderItem={({ item }) => { return <ListItem><Text style={styles.item}>{item}</Text></ListItem>; }}
          renderSectionHeader={
            ({ section }) => {
              return <ListItem itemHeader style={styles.sectionHeader}><Text style={styles.headerText}>{section.title}</Text></ListItem>;
            }
      }
          keyExtractor={(item, index) => { return index; }}
        />
      </ScrollView>
    </View>
  );
};
