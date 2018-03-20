import React from 'react';
import { Platform, View } from 'react-native';
import {
  Button,
  Icon, Text
} from 'native-base';
import {
  StackNavigator,
  TabNavigator,
  DrawerNavigator,
} from 'react-navigation';
import * as Constant from './Constant';
import TabA from '../class/TabA/TabA';
import TabB from '../class/TabB/TabB';
import TabD from '../class/TabD/TabD';
import TabC from '../class/TabC/TabC';
import CustomDrawer from './CustomDrawer';
import PageA from '../class/Page/PageA';
import PageB from '../class/Page/PageB';
import PageC from '../class/Page/PageC';
import RestaurantIndex from '../class/Restaurant/RestaurantIndex';
import RestaurantList from '../class/Restaurant/RestaurantList';
import RestaurantShow from '../class/Restaurant/RestaurantShow';
import RestaurantFiveUserList from '../class/Restaurant/RestaurantFiveUserList';
import MusicIndex from '../class/Music/MusicIndex';
import MusicList from '../class/Music/MusicList';
import MusicShow from '../class/Music/MusicShow';
import MusicFiveUserList from '../class/Music/MusicFiveUserList';
import BookIndex from '../class/Book/BookIndex';
import BookList from '../class/Book/BookList';
import BookShow from '../class/Book/BookShow';
import BookFiveUserList from '../class/Book/BookFiveUserList';
import Invitation from '../class/Invitation/Invitation';
import UserList from '../class/User/UserList';
import UserShow from '../class/User/UserShow';
import UserFollowerIndex from '../class/User/UserFollowerIndex';
import UserFolloweeIndex from '../class/User/UserFolloweeIndex';
import Map from '../class/Page/Map';
import Setting from '../class/Setting/Setting';
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
import ProfileFiveAddMusic from '../class/Profile/ProfileFiveAddMusic';
import ProfileFiveAddBook from '../class/Profile/ProfileFiveAddBook';
import ModalWebViewShow from '../class/Auth/ModalWebViewShow';
import InfoEdit from '../class/Setting/InfoEdit';
import AccountEdit from '../class/Setting/AccoutEdit';
import AlarmEdit from '../class/Setting/AlarmEdit';
import CategoryEdit from '../class/Setting/CategoryEdit';

const TabNavigation = TabNavigator(
    {
      TabA: {
        screen: TabA,
      },
      TabC: {
        screen: TabC,
      },
      TabD: {
        screen: TabD,
      },
      TabB: {
        screen: TabB,
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
    }
);

const StackNavigation = StackNavigator(
  {
    /*    Main: {
          screen: ({ navigation }) => <TabNavigation screenProps={{ rootNavigation: navigation }}/>,
        },*/
    Main: {
      screen: TabNavigation
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
    RestaurantIndex: {
      screen: RestaurantIndex,
    },
    RestaurantList: {
      screen: RestaurantList,
    },
    RestaurantShow: {
      screen: RestaurantShow,
    },
    RestaurantFiveUserList: {
      screen: RestaurantFiveUserList,
    },
    MusicIndex: {
      screen: MusicIndex,
    },
    MusicList: {
      screen: MusicList,
    },
    MusicShow: {
      screen: MusicShow,
    },
    MusicFiveUserList: {
      screen: MusicFiveUserList,
    },
    BookIndex: {
      screen: BookIndex,
    },
    BookList: {
      screen: BookList,
    },
    BookShow: {
      screen: BookShow,
    },
    BookFiveUserList: {
      screen: BookFiveUserList,
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
    UserFollowerIndex: {
      screen: UserFollowerIndex,
    },
    UserFolloweeIndex: {
      screen: UserFolloweeIndex,
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
    ProfileFiveAddMusic: {
      screen: ProfileFiveAddMusic,
    },
    ProfileFiveAddBook: {
      screen: ProfileFiveAddBook,
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
    headerMode: 'screen',
    mode: 'card',
  },
);

const DrawerNavigation = DrawerNavigator(
  {
    Main: {
      screen: StackNavigation
    }
  },
  {
    headerMode: 'none',
    drawerWidth: 300,
    drawerPosition: 'right',
   // contentComponent: CustomDrawer,
  },
);

const RootNavigation = StackNavigator(
  {
    Main: {
      screen: ({ navigation }) => <DrawerNavigation screenProps={{ modalNavigation: navigation }}/>,
    },
    ModalWebViewShow: {
      screen: ({ navigation }) => <ModalWebViewShow screenProps={{ modalNavigation: navigation }}/>,
    },
    Map: {
      screen: ({ navigation }) => <Map screenProps={{ modalNavigation: navigation }}/>,
    },
  }, {
    headerMode: 'none',
    mode: 'modal',
  },
);

export default RootNavigation;
