import React, {
  Component,
} from 'react';
import {
  AsyncStorage,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {
  Toast,
  Spinner,
} from 'native-base';
import axios from 'axios';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import {
  observer,
} from 'mobx-react/native';
import ApplicationStore from '../../mobx/ApplicationStore';
import {
  LoginButton,
  AccessToken,
} from 'react-native-fbsdk';

@observer
export default class FacebookAuth extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: false };
  }

  tryFBSignUp(access_token) {
    axios.post(ApiServer.FB_SIGN_UP, {
      data: {
        access_token: access_token,
      },
    }).then((response) => {
      this.onLoginSuccess(response.data);
    })
      .catch((error) => {
        console.log(error.response);
        this.onLoginFail(error.response.data);
      });
  }

  onLoginSuccess(data) {
    AsyncStorage.multiSet([
      [ 'email', data.email ],
      [ 'token', data.authentication_token ],
      [ 'key', data.key ],
    ]).then(() => {
      ApplicationStore.setAuthInfo().then(() => {
        this.setState({
          loading: false,
        });
      });
    });
    this.props.authSuccessCallback(); //여기 먼가 잘 안됨
  }

  onLoginFail(data) {
    this.setState({
      loading: false,
      error: JSON.stringify(data.errors),
    }, () => this.toastError());
  }

  toastError() {
    Toast.show({
      text: this.state.error,
      position: 'bottom',
      buttonText: '확인',
      duration: 1000,
    });
  }

  renderFBButton() {
    if (this.state.loading) {
      return <Spinner size="small"/>;
    }

    return (
      <LoginButton
        readPermissions={[ 'email', 'public_profile', 'user_friends' ]}
        onLoginFinished={
          (error, result) => {
            if (error) {
              alert('login has error: ' + result.error);
            } else if (result.isCancelled) {
              alert('login is cancelled.');
            } else {
              AccessToken.getCurrentAccessToken().then(
                (data) => {
                  this.tryFBSignUp(data.accessToken.toString());
                },
              );
            }
          }
        }
        onLogoutFinished={() => alert('logout.')}/>
    );
  }

  render() {
    const { container } = BaseStyle;

    return (
      <View style={container}>
        {this.renderFBButton()}
      </View>
    );
  }
}
