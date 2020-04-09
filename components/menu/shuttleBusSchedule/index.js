/* eslint-disable max-len */
/* eslint-disable radix */
import React, { Component, useState } from 'react';
import {
  View, Text, ScrollView, SectionList, RefreshControl
} from 'react-native';
import {
  ListItem, Body, Tabs, Tab, Badge
} from 'native-base';
import useForceUpdate from 'use-force-update';
import shuttleScheduleInformation from './shuttleScheduleService';
import styles from './styles';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
function wait(timeout) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}
export default class ShuttleSchedule extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Tabs>
          <Tab heading="SGW" textStyle={{ background: 'white' }} tabStyle={{ backgroundColor: '#00d4ff' }} activeTabStyle={{ backgroundColor: '#00d4ff' }}>

            <Schedule selectedButtonIndex={0} />
          </Tab>
          <Tab heading="LOY" textStyle={{ background: 'white' }} tabStyle={{ backgroundColor: '#00d4ff' }} activeTabStyle={{ backgroundColor: '#00d4ff' }}>
            <Schedule selectedButtonIndex={1} />
          </Tab>
        </Tabs>

      </View>
    );
  }
}


const Schedule = (props) => {
  const forceUpdate = useForceUpdate();
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    forceUpdate();
    wait(900).then(() => { return setRefreshing(false); });
  }, [refreshing]);

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
          refreshControl={(
            <RefreshControl
                    // refresh control used for the Pull to Refresh
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
                )}
          sections={[
            {
              title: props.selectedButtonIndex === 0
                ? 'Sir George Williams Campus' : 'Loyola Campus',
              data: getShuttleCampusInformation(props.selectedButtonIndex)
            },
          ]}
          renderItem={({ item }) => {
            const todayWithHoursMinuites = new Date();
            todayWithHoursMinuites.setHours(`${item.split(':')[0]}`);
            todayWithHoursMinuites.setMinutes(`${item.split(':')[1]}`);
            const today = new Date();
            const diff = today.getTime() - todayWithHoursMinuites.getTime();
            const resultInMinutes = Math.round(Math.abs(diff / 60000));
            const passOrRemain = Math.sign(diff) === 1 ? 'passed' : 'remaining';

            const hours = Math.floor(resultInMinutes / 60);
            const minutes = resultInMinutes % 60;
            // const hourRemaining = Math.abs(parseInt(today.getHours()) - parseInt(item.split(':')[0]));
            // const minuiteRemaining = Math.abs(parseInt(today.getMinutes()) - parseInt(item.split(':')[1]));
            const timeRemaining = `${hours} hours and ${minutes} Minuites ${passOrRemain}`;
            return (
              <ListItem>
                { (Math.sign(diff) === -1 && resultInMinutes < 20)
                && (
                <Badge
                  info
                  style={{
                    position: 'absolute', margin: 20, right: 0
                  }}
                >
                  <Text style={{ top: 2 }}>Soon!</Text>
                </Badge>
                )}
                <Body style={{ }}>
                  <Text style={styles.item}>{item}</Text>
                  <Text note style={styles.remaining}>{timeRemaining}</Text>
                </Body>
              </ListItem>

            );
          }}
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
