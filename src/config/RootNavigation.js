import React from 'react';
import {
  StackNavigator,
} from 'react-navigation';
import TabNavigation from '../config/TabNavigation';
import PageA from '../class/Page/PageA';
import PageB from '../class/Page/PageB';
import PageC from '../class/Page/PageC';

const RootNavigation = StackNavigator(
  {
    Main: {
      screen: ({ navigation }) => <TabNavigation screenProps={{ rootNavigation: navigation }} />,
      navigationOptions: ({ navigation }) => ({
        title: '아스트로',
      }),
    },
    PageA: {
      screen: PageA,
      navigationOptions: ({ navigation }) => ({
        title: navigation.state.params.title,
      }),
    },
    PageB: {
      screen: PageB,
      navigationOptions: ({ navigation }) => ({
        title: navigation.state.params.title,
      }),
    },
    PageC: {
      screen: PageC,
      navigationOptions: {
        header: null,
      },
    },

  },
  {
    headerMode: 'float',
    mode: 'card',
  },
);

export default RootNavigation;
