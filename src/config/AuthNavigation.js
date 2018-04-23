import React from 'react';
import { Platform } from 'react-native';
import {
  Button, Icon,
} from 'native-base';
import {
  StackNavigator,
} from 'react-navigation';
import StartForm from '../class/Auth/StartForm';
import LogInForm from '../class/Auth/LogInForm';
import FindPassword from '../class/Auth/FindPassword';
import SignUpForm from '../class/Auth/SignUpForm';
import ModalWebViewShow from '../class/Auth/ModalWebViewShow';
import Hello from '../class/Hello/Hello';
import Tutorial from '../class/Hello/Tutorial';
import Map from '../class/Page/Map';

const CardNavigation = StackNavigator(
  {
    Main: {
      screen: Tutorial,
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

export default AuthNavigation;
