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
import * as Constant from './Constant';
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
import Setting from '../class/Setting/Setting';
import FriendIndex from '../class/Friend/FriendIndex';
import NoticeIndex from '../class/Notice/NoticeIndex';
import NoticeShow from '../class/Notice/NoticeShow';
import UserFiveShow from '../class/User/UserFiveShow';
import ProfileFiveIndex from '../class/Profile/ProfileFiveIndex';
import ProfileWishIndex from '../class/Profile/ProfileWishIndex';
import ProfileFiveEdit from '../class/Profile/ProfileFiveEdit';
import ProfileFollowerIndex from '../class/Profile/ProfileFollowerIndex';
import ProfileFolloweeIndex from '../class/Profile/ProfileFolloweeIndex';
import FiveStoryShow from '../class/Page/FiveStoryShow';
import ProfileFiveAddRestaurant from '../class/Profile/ProfileFiveAddRestaurant';
import ModalWebViewShow from '../class/Auth/ModalWebViewShow';
import InfoEdit from '../class/Setting/InfoEdit';
import AccountEdit from '../class/Setting/AccoutEdit';
import AlarmEdit from '../class/Setting/AlarmEdit';
import CategoryEdit from '../class/Setting/CategoryEdit';

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
            activeTintColor: Constant.FiveColor,
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
    FriendIndex: {
      screen: FriendIndex,
    },
    NoticeIndex: {
      screen: NoticeIndex,
    },
    NoticeShow: {
      screen: NoticeShow,
    },
    UserFiveShow: {
      screen: UserFiveShow,
    },
    ProfileFiveIndex: {
      screen: ProfileFiveIndex,
    },
    ProfileWishIndex: {
      screen: ProfileWishIndex,
    },
    ProfileFiveEdit: {
      screen: ProfileFiveEdit,
    },
    ProfileFollowerIndex: {
      screen: ProfileFollowerIndex,
    },
    ProfileFolloweeIndex: {
      screen: ProfileFolloweeIndex,
    },
    FiveStoryShow: {
      screen: FiveStoryShow,
    },
    ProfileFiveAddRestaurant: {
      screen: ProfileFiveAddRestaurant,
    },
    Setting: {
      screen: Setting,
    },
    InfoEdit: {
      screen: InfoEdit,
    },
    AccountEdit: {
      screen: AccountEdit,
    },
    AlarmEdit: {
      screen: AlarmEdit,
    },
    CategoryEdit: {
      screen: CategoryEdit,
    },
  }, {
    headerMode: Platform.OS === 'ios' ? 'float' : 'screen',
    mode: 'card',
  },
);

const ModalNavigation = StackNavigator(
  {
    Main: {
      screen: ({ navigation }) => <StackNavigation screenProps={{ modalNavigation: navigation }}/>,
    },
    ModalWebViewShow: {
      screen: ({ navigation }) => <ModalWebViewShow screenProps={{ modalNavigation: navigation }}/>,
    },
  }, {
    headerMode: 'none',
    mode: 'modal',
  },
);

const RootNavigation = DrawerNavigator(
  {
    Main: {
      screen: ModalNavigation,
    },
  },
  {
    drawerWidth: 300,
    drawerPosition: 'right',
    contentComponent: CustomDrawer,
  },
);

export default RootNavigation;
