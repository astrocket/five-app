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
  Root,
  StyleProvider,
  Spinner,
  Button,
} from 'native-base';
import getTheme from './native-base-theme/components';
import platform from './native-base-theme/variables/platform';
import BaseStyle from './src/config/BaseStyle';
import RootNavigation from './src/config/RootNavigation';
import {
  observer,
} from 'mobx-react/native';
import ApplicationStore from './src/mobx/ApplicationStore';

/*
import FacebookAuth from './src/class/Auth/FacebookAuth';
*/

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
          ApplicationStore.setAuthInfo().then(() => {
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
    ]).then(() => {
      ApplicationStore.setAuthInfo().then(() => {
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
        <Root>
          <StyleProvider style={getTheme(platform)}>
            <View style={container}>
              <Spinner size="large"/>
              <Text>로딩중</Text>
            </View>
          </StyleProvider>
        </Root>
      );
    } else {
      if (this.state.loggedIn) {
        return (
          <Root>
            <StyleProvider style={getTheme(platform)}>
              <RootNavigation/>
            </StyleProvider>
          </Root>
        );
      }
      else {
        return (
          <Root>
            <StyleProvider style={getTheme(platform)}>
              <View style={container}>
                {/*                                <FacebookAuth
                                    authSuccessCallback={() => this.authSuccessCallback()}
                                />*/}
                <Spinner size="large"/>
                <Button onPress={() => this.fakeAuthCallback()}>
                  <Text>임시 로그인 하기</Text>
                </Button>
              </View>
            </StyleProvider>
          </Root>
        );
      }
    }
  }
}
