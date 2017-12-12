import React from 'react';
import { Platform } from 'react-native';
import {
  Button,
  Icon,
} from 'native-base';
import {
  StackNavigator,
  TabNavigator,
  DrawerNavigator,
} from 'react-navigation';
import TabA from '../class/TabA/TabA';
import TabB from '../class/TabB/TabB';
import TabC from '../class/TabC/TabC';
import CustomDrawer from './CustomDrawer';
import PageA from '../class/Page/PageA';
import PageB from '../class/Page/PageB';
import PageC from '../class/Page/PageC';
import FoodIndex from '../class/Food/FoodIndex';
import FoodList from '../class/Food/FoodList';
import FoodShow from '../class/Food/FoodShow';
import Invitation from '../class/Invitation/Invitation';
import UserList from '../class/User/UserList';
import UserShow from '../class/User/UserShow';

const StackNavigation = StackNavigator(
  {
    /*    Main: {
          screen: ({ navigation }) => <TabNavigation screenProps={{ rootNavigation: navigation }}/>,
        },*/
    Main: {
      screen: TabNavigator(
        {
          TabA: {
            screen: TabA,
          },
          TabB: {
            screen: TabB,
          },
          TabC: {
            screen: TabC,
          },
        }),
    },
    PageA: {
      screen: PageA,
    },
    PageB: {
      screen: PageB,
    },
    PageC: {
      screen: PageC,
      navigationOptions: {
        header: null,
      },
    },
    FoodIndex: {
      screen: FoodIndex,
    },
    FoodList: {
      screen: FoodList,
    },
    FoodShow: {
      screen: FoodShow,
    },
    Invitation: {
      screen: Invitation,
    },
    UserList: {
      screen: UserList,
    },
    UserShow: {
      screen: UserShow,
    },
  }, {
    headerMode: Platform.OS === 'ios' ? 'float' : 'screen',
    mode: 'card',
  },
);

const RootNavigation = DrawerNavigator(
  {
    Main: {
      screen: StackNavigation,
    },
  },
  {
    drawerWidth: 200,
    drawerPosition: 'left',
    contentComponent: CustomDrawer
  },
);

export default RootNavigation;
