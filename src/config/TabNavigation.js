import React, { Component } from 'react';
import {
  Platform,
} from 'react-native';
import {
  Icon,
} from 'native-base';
import { TabNavigator } from 'react-navigation';
import TabA from '../class/TabA/TabA';
import TabB from '../class/TabB/TabB';
import TabC from '../class/TabC/TabC';

const TabContainer = ({ initialRouteName, screenProps }) => {
  const routeConfigs = {
    TabA: {
      screen: TabA,
      navigationOptions: {
        tabBarLabel: '사랑',
        tabBarIcon: ({ tintColor }) => (
          <Icon
            name="ios-search-outline"
            style={{
              fontSize: 25,
              color: tintColor,
            }}
          />
        ),
      },
    },
    TabB: {
      screen: TabB,
      navigationOptions: {
        tabBarLabel: '꿈',
        tabBarIcon: ({ tintColor }) => (
          <Icon
            name="ios-list-box-outline"
            style={{
              fontSize: 25,
              color: tintColor,
            }}
          />
        ),
      },
    },
    TabC: {
      screen: TabC,
      navigationOptions: {
        tabBarLabel: '행복',
        tabBarIcon: ({ tintColor }) => (
          <Icon
            name="ios-color-filter-outline"
            style={{
              fontSize: 25,
              color: tintColor,
            }}
          />
        ),
      },
    },
  };
  const tabNavigationConfigs = {
    initialRouteName: initialRouteName,
    swipeEnabled: false,
    tabBarPosition: 'bottom',
    tabBarOptions: {
      activeTintColor: '#990008',
      inactiveTintColor: '#9e9e9e',
      indicatorStyle: {
        backgroundColor: 'transparent',
      },
      showIcon: true,
      showLabel: Platform.OS === 'ios',
      labelStyle: {
        fontSize: 12,
      },
      style: {
        backgroundColor: '#fff',
      },
    },
  };
  const TabNav = TabNavigator(routeConfigs, tabNavigationConfigs);
  return (
    <TabNav
      screenProps={screenProps}
    />
  );
};

export default class TabNavigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabTo: 'TabA',
    };
  }

  componentWillMount() {
    if (typeof this.props.screenProps.rootNavigation.state.params !== 'undefined') {
      this.setState({
        tabTo: this.props.screenProps.rootNavigation.state.params.tabTo,
      });
    }
  }

  render() {
    return (
      <TabContainer
        initialRouteName={this.state.tabTo}
        screenProps={this.props.screenProps}
      />
    );
  }
}
