import {
  Dimensions
} from 'react-native';

export const FiveColor = '#FA3F97';
export const GreyColor = '#A1A1A1';

export const FiveNavOptions = {
  headerStyle: {
    backgroundColor: 'white',
  },
  headerTintColor: '#FA3F97',
  headerBackTitleStyle: {
    color: '#FA3F97',
  },
  headerTitleStyle: {
    color: 'black',
  },
  drawerLockMode: 'locked-closed',
};

export const deviceWidth = Dimensions.get('window').width;