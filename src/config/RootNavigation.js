import React from 'react';
import {
  StackNavigator,
} from 'react-navigation';
import TabNavigation from '../config/TabNavigation';
import PageA from '../class/Page/PageA';
import PageB from '../class/Page/PageB';
import PageC from '../class/Page/PageC';
import FoodIndex from '../class/Food/FoodIndex';
import FoodList from '../class/Food/FoodList';
import FoodShow from '../class/Food/FoodShow';


const RootNavigation = StackNavigator(
  {
    Main: {
      screen: ({ navigation }) => <TabNavigation screenProps={{ rootNavigation: navigation }}/>,
      navigationOptions: ({ navigation }) => ({
        title: 'MYFIVE',
        headerStyle: {
          backgroundColor: '#FF9800',
        },
        headerTintColor: 'white',
        headerBackTitleStyle: {
          color: 'white',
        },
        headerTitleStyle: {
          color: 'white',
        },
      }),
    },
    PageA: {
      screen: PageA,
      navigationOptions: ({ navigation }) => ({
        title: navigation.state.params.title,
        headerStyle: {
          backgroundColor: '#FF9800',
        },
        headerTintColor: 'white',
        headerBackTitleStyle: {
          color: 'white',
        },
        headerTitleStyle: {
          color: 'white',
        },
      }),
    },
    PageB: {
      screen: PageB,
      navigationOptions: ({ navigation }) => ({
        title: navigation.state.params.title,
        headerStyle: {
          backgroundColor: '#FF9800',
        },
        headerTintColor: 'white',
        headerBackTitleStyle: {
          color: 'white',
        },
        headerTitleStyle: {
          color: 'white',
        },
      }),
    },
    PageC: {
      screen: PageC,
      navigationOptions: {
        header: null,
      },
    },
    FoodIndex: {
      screen: FoodIndex,
      navigationOptions: ({ navigation }) => ({
        title: navigation.state.params.title,
        headerStyle: {
          backgroundColor: '#FF9800',
        },
        headerTintColor: 'white',
        headerBackTitleStyle: {
          color: 'white',
        },
        headerTitleStyle: {
          color: 'white',
        },
      }),
    },
    FoodList: {
      screen: FoodList,
      navigationOptions: ({ navigation }) => ({
        title: navigation.state.params.title,
        headerStyle: {
          backgroundColor: '#FF9800',
        },
        headerTintColor: 'white',
        headerBackTitleStyle: {
          color: 'white',
        },
        headerTitleStyle: {
          color: 'white',
        },
      }),
    },
    FoodShow: {
      screen: FoodShow,
      navigationOptions: ({ navigation }) => ({
        title: navigation.state.params.title,
        headerStyle: {
          backgroundColor: '#FF9800',
        },
        headerTintColor: 'white',
        headerBackTitleStyle: {
          color: 'white',
        },
        headerTitleStyle: {
          color: 'white',
        },
      }),
    },

  },
  {
    headerMode: 'float',
    mode: 'card',
  },
);

export default RootNavigation;
