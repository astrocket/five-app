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
import RestaurantIndex from '../class/Restaurant/RestaurantIndex';
import RestaurantNew from '../class/Restaurant/RestaurantNew';
import RestaurantList from '../class/Restaurant/RestaurantList';
import RestaurantShow from '../class/Restaurant/RestaurantShow';
import Invitation from '../class/Invitation/Invitation';
import UserList from '../class/User/UserList';
import UserShow from '../class/User/UserShow';
import Map from '../class/Page/Map';
import FollowIndex from '../class/Follow/FollowIndex';
import MyItemIndex from '../class/Item/MyItemIndex';
import Setting from '../class/Page/Setting';
import UserInfoNew from '../class/User/UserInfoNew';
import UserImageNew from '../class/User/UserImageNew';
import FriendIndex from '../class/Friend/FriendIndex';
import NoticeIndex from '../class/Notice/NoticeIndex';
import NoticeShow from '../class/Notice/NoticeShow';

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
        }, {
          swipeEnabled: false,
          tabBarPosition: 'bottom',
          tabBarOptions: {
            activeTintColor: '#FF9800',
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
          }
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
    RestaurantNew: {
      screen: RestaurantNew,
    },
    RestaurantIndex: {
      screen: RestaurantIndex,
    },
    RestaurantList: {
      screen: RestaurantList,
    },
    RestaurantShow: {
      screen: RestaurantShow,
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
    Map: {
      screen: Map,
    },
    FollowIndex: {
      screen: FollowIndex,
    },
    MyItemIndex: {
      screen: MyItemIndex,
    },
    Setting: {
      screen: Setting,
    },
    UserInfoNew: {
      screen: UserInfoNew,
    },
    UserImageNew: {
      screen: UserImageNew,
    },
    FriendIndex: {
      screen: FriendIndex,
    },
    NoticeIndex: {
      screen: NoticeIndex,
    },
    NoticeShow: {
      screen: NoticeShow,
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
