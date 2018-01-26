import React, { Component } from 'react';
import {
  View, AsyncStorage, Keyboard,
} from 'react-native';
import {
  Container, Header, Content, Text, Spinner, Icon, Button, Toast,
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import { InputSingle, InputToggle, BottomFullButton } from '../../component/common';
import axios from 'axios';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('ApplicationStore') // Inject some or all the stores!
@observer
export default class FindPassword extends Component {

  static navigationOptions = ({ navigation }) => ({
    headerStyle: {
      backgroundColor: 'white',
      borderBottomWidth: 0,
    },
    headerTintColor: '#FA3F97',
    headerBackTitleStyle: {
      color: '#FA3F97',
    },
    headerTitleStyle: {
      color: 'black',
    },
    drawerLockMode: 'locked-closed',
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      user: this.props.navigation.state.params.user,
      message: 0,
      input_gender: '',
      input_birth: '',
      input_password: '',
      input_password_confirmation: '',
      authenticated: false,
      reset_token: '',
    };
  }

  authCheck() {
    this.setState({ submiting: true });

    // rails server 에 로그인 시도하는 부분. 로그인 시도하고 서버에서 나온 결과값에 따라서 토스트메세지를 띄운다.
    axios.post(`${ApiServer.PHONE}/authorize_reset_password`, {
      user: {
        email: '01011112223@myfive.users',//this.state.user.email,
        birthyear: this.state.input_birth,
        gender: this.state.input_gender,
      },
    }).then((response) => {
      this.onAuthCheckSuccess(response.data);
    }).catch((error) => {
      this.setState({ submiting: false });
      Toast.show({
        text: JSON.stringify(error.response.data.errors),
        position: 'bottom',
        duration: 1500,
      });
    });
  }

  onAuthCheckSuccess(data) {
    this.setState({
      reset_token: data.reset_token,
      authenticated: true,
      submiting: false,
    });
  }

  passwordUpdate() {
    this.setState({ submiting: true });

    // rails server 에 로그인 시도하는 부분. 로그인 시도하고 서버에서 나온 결과값에 따라서 토스트메세지를 띄운다.
    axios.patch(`${ApiServer.USERS}/password`, {
      user: {
        reset_password_token: this.state.reset_token,
        password: this.state.input_password,
        password_confirmation: this.state.input_password_confirmation,
      },
    }).then((response) => {
      this.passwordUpdateSuccess(response.data);
    }).catch((error) => {
      this.setState({ submiting: false });
      Toast.show({
        text: JSON.stringify(error.response.data.password_confirmation[0]),
        position: 'bottom',
        duration: 1500,
      });
    });
  }

  passwordUpdateSuccess(data) {
    AsyncStorage.multiSet([
      [ 'email', data.email ],
      [ 'token', data.authentication_token ],
      [ 'key', data.key ],
    ]).then(() => {
      this.props.ApplicationStore.setAuthInfo();
    });
  }

  renderMessage() {
    switch (this.state.message) {
      case 0:
        return <Text key={0} note>{this.state.user.name}님{'\n'}본인이 맞는지 간단한 확인만 하고{'\n'}새 비밀번호를
          설정할게요.</Text>;
      default:
        return <Text key={this.state.message} note>{this.state.message}</Text>;
    }
  }

  renderPasswordForm() {
    if (this.state.authenticated) {
      return (
        <View key={2}>
          <Row>
            <InputSingle
              placeholder={'새로운 비밀번호 (6자리 이상)'}
              value={''}
              autoFocus={true}
              onChangeText={(input_password) => this.setState({ input_password })}
              onSubmitEditing={Keyboard.dismiss}
              returnKeyType={'next'}
              secureTextEntry
              noButton
            />
          </Row>
          <Row>
            <InputSingle
              placeholder={'새로운 비밀번호 재입력'}
              value={''}
              onChangeText={(input_password_confirmation) => this.setState({ input_password_confirmation })}
              onSubmitEditing={() => this.passwordUpdate()}
              returnKeyType={'done'}
              secureTextEntry
              noButton
            />
          </Row>
        </View>
      );
    } else {
      return (
        <View key={1}>
          <Row>
            <InputSingle
              placeholder={'출생년도 두 자리 숫 (예: 92)'}
              value={''}
              autoFocus={true}
              onChangeText={(input_birth) => this.setState({ input_birth })}
              onSubmitEditing={Keyboard.dismiss}
              returnKeyType={'next'}
              keyboardType={'numeric'}
              noButton
            />
          </Row>
          <Row>
            <InputToggle
              leftText={'여자'}
              leftClicked={this.state.left_clicked}
              rightText={'남자'}
              rightClicked={this.state.right_clicked}
              onLeftPress={() => this.setState({
                input_gender: 'F',
                left_clicked: true,
                right_clicked: false,
              })}
              onRightPress={() => this.setState({
                input_gender: 'M',
                left_clicked: false,
                right_clicked: true,
              })}
            />
          </Row>
        </View>
      );
    }
  }

  renderButton() {
    if (this.state.submiting) {
      return <Spinner size="small"/>;
    }

    if (this.state.authenticated) {
      return (
        <BottomFullButton onPress={() => this.passwordUpdate()}>
          변경
        </BottomFullButton>
      );
    } else {
      return (
        <BottomFullButton onPress={() => this.authCheck()}>
          확인
        </BottomFullButton>
      );
    }
  }

  render() {
    const { container, preLoading } = BaseStyle;
    const { navigation } = this.props;

    return (
      <Container>
        <Content padder>
          <Grid>
            <Row>
              <Text xlarge>본인 확인</Text>
            </Row>
            <Row style={{
              justifyContent: 'flex-end',
              marginBottom: 20,
            }}>
              <View style={{
                width: Constant.deviceWidth / 2,
                height: 100,
              }}>
                {this.renderMessage()}
              </View>
            </Row>
            {this.renderPasswordForm()}
          </Grid>
        </Content>
        <View style={{ height: 50, }}>
          {this.renderButton()}
        </View>
        {this.state.loading &&
        <View style={preLoading}>
          <Spinner size="large"/>
        </View>
        }
      </Container>
    );
  }
}
