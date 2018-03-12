import React from 'react';
import { Platform } from 'react-native';
import {
  Button, Icon,
} from 'native-base';
import {
  StackNavigator,
} from 'react-navigation';
import Welcome from '../class/Auth/Welcome';
import StartForm from '../class/Auth/StartForm';
import LogInForm from '../class/Auth/LogInForm';
import FindPassword from '../class/Auth/FindPassword';
import SignUpForm from '../class/Auth/SignUpForm';
import ModalWebViewShow from '../class/Auth/ModalWebViewShow';
import Hello from '../class/Hello/Hello';
import Tutorial from '../class/Hello/Tutorial';
import FiveSelect from '../class/Hello/FiveSelect';
import AddFiveRestaurant from '../class/Search/AddFiveRestaurant';
import Map from '../class/Page/Map';

const CardNavigation = StackNavigator(
  {
    Main: {
      screen: Welcome,
    },
    StartForm: {
      screen: StartForm,
    },
    LogInForm: {
      screen: LogInForm,
    },
    FindPassword: {
      screen: FindPassword,
    },
    SignUpForm: {
      screen: SignUpForm,
    },
    Hello: {
      screen: Hello,
    },
    Tutorial: {
      screen: Tutorial,
    },
    FiveSelect: {
      screen: FiveSelect,
    },
    AddFiveRestaurant: {
      screen: AddFiveRestaurant,
    },
  }, {
    headerMode: Platform.OS === 'ios' ? 'float' : 'screen',
    mode: 'card'
  },
);

const AuthNavigation = StackNavigator(
  {
    Main: {
      screen: ({ navigation }) => <CardNavigation screenProps={{ modalNavigation: navigation }}/>,
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
  }
);

{/*<Button onPress={() => this.props.screenProps.modalNavigation.navigate('ModalWebViewShow', {
  url: `${ApiServer.FIVE_STORY}/31`,
  headerTitle: '웹뷰'
})}>
  <Text>모달</Text>
</Button>*/}

export default AuthNavigation;
