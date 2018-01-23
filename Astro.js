/**
 * Astro Boiler App
 * https://github.com/astrocket
 * init, 2017.11.21
 */
import React, {
  Component,
} from 'react';
import {
  AsyncStorage,
  Text,
  View,
} from 'react-native';
import {
  StyleProvider,
  Spinner,
  Button,
} from 'native-base';
import getTheme from './native-base-theme/components';
import platform from './native-base-theme/variables/platform';
import BaseStyle from './src/config/BaseStyle';
import RootNavigation from './src/config/RootNavigation';
import AuthNavigation from './src/config/AuthNavigation';
import { observer, inject } from 'mobx-react/native';

@inject('ApplicationStore') // Inject some or all the stores!
@observer
export default class App extends Component<{}> {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      loggedIn: false,
    };
  }

  componentWillMount() {
    let isAuthenticated;
    AsyncStorage.getItem('token')
      .then((result) => {
        if (result) {
          isAuthenticated = true;
          this.props.ApplicationStore.setAuthInfo().then(() => {
            this.setState({
              loggedIn: isAuthenticated,
              loading: false,
            });
          });
        } else {
          isAuthenticated = false;
          this.setState({
            loggedIn: isAuthenticated,
            loading: false,
          });
        }
      });
  }

  fakeAuthCallback() {
    AsyncStorage.multiSet([
      [ 'email', 'astro@insomenia.com' ],
      [ 'token', 'astrotoken' ],
      [ 'key', 'astrokey' ],
      [ 'login', true ],
    ]).then(() => {
      this.props.ApplicationStore.setAuthInfo().then(() => {
        this.setState({
          loggedIn: true,
          loading: false,
        });
      });
    });
  }

  authSuccessCallback() {
    this.setState({
      loggedIn: true,
      loading: false,
    });
  }

  render() {
    const { container } = BaseStyle;
    if (this.state.loading) {
      return (
        <StyleProvider style={getTheme(platform)}>
          <View style={container}>
            <Spinner size="large"/>
            <Text>로딩중</Text>
          </View>
        </StyleProvider>
      );
    } else {
      if (this.props.ApplicationStore.login) {
        return (
          <StyleProvider style={getTheme(platform)}>
            <RootNavigation
              initialRotueName={'PageB'}
            />
          </StyleProvider>
        );
      }
      else {
        return (
          <StyleProvider style={getTheme(platform)}>
            <AuthNavigation/>
          </StyleProvider>
        );
      }
    }
  }
}
