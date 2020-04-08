import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    backgroundColor: '#F5FCFF'
  },
  list: {
    width: '100%',
    flex: 1,
    marginTop: 20,
  },
  headerText: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  sectionHeader: {
    width: '100%',
    height: 60,
    alignSelf: 'center',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e9f1f5',
  },
  remaining: {
    textAlign: 'center',
  },
  item: {
    width: '100%',
    flex: 1,
    padding: '6%',
    fontSize: 18
  },
});

export default styles;
