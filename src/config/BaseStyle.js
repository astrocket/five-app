import {
  Platform,
  StyleSheet,
} from 'react-native';

const platform = Platform.OS;
const BaseStyle = StyleSheet.create({
  preLoading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    paddingTop: platform.OS === 'ios' ? 20 : 0,
  },
  headerDoubleIconsContainer: {
    flexDirection: 'row',
    width: null,
  },
  flexAroundCenter: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  flexBetweenCenter: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  flexCenterCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  centerCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  topLeftLabel: {
    position: 'absolute',
    top: 15,
    left: 15,
  },
  topRightLabel: {
    position: 'absolute',
    top: 15,
    right: 15,
  }
});

export default BaseStyle;
