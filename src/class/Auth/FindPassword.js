import React, { Component } from 'react';
import {
  View, AsyncStorage, Keyboard, TouchableOpacity, Alert,
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
import { ErrorHandler } from '../../config/helpers';
import { observer, inject } from 'mobx-react/native';

@inject('ApplicationStore') // Inject some or all the stores!
@observer
export default class FindPassword extends Component {

  static navigationOptions = ({ navigation }) => ({
    header: null,
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
      misTypeCounter: 0,
    };
  }

  authCheck() {
    const regExp = /^[(0-9)]{2}$/;
    if (!regExp.test(this.state.input_birth)) {
      ErrorHandler(
        '잘못된 출생년도 입니다. 2자리 숫자만 입력하세요.',
        () => this.setState({ input_birth: '' })
      );
      return false;
    }

    if (this.state.input_gender === '') {
      ErrorHandler(
        '성별이 선택되지 않았습니다.',
        () => this.setState({ input_gender: '' })
      );
      return false;
    }

    this.setState({ submiting: true });

    // rails server 에 로그인 시도하는 부분. 로그인 시도하고 서버에서 나온 결과값에 따라서 토스트메세지를 띄운다.
    axios.post(`${ApiServer.PHONE}/authorize_reset_password`, {
      user: {
        email: this.state.user.email,
        birthyear: this.state.input_birth,
        gender: this.state.input_gender,
      },
    }).then((response) => {
      this.onAuthCheckSuccess(response.data);
    }).catch((error) => {
      if (this.state.misTypeCounter > 0) {
        this.askCustomerCenter();
      } else {
        this.setState({
          submiting: false,
          misTypeCounter: this.state.misTypeCounter + 1,
        });
        ErrorHandler(JSON.stringify(error.response.data.errors));
      }
    });
  }

  onAuthCheckSuccess(data) {
    this.setState({
      reset_token: data.reset_token,
      authenticated: true,
      submiting: false,
    });
  }

  askCustomerCenter() {
    this.setState({
      submiting: false,
    });
    Alert.alert(
      '일치하는 회원정보가 없습니다.',
      '회원정보 문의를 위해 고객 센터로 연결합니다.',
      [
        {
          text: '아니요',
          style: 'cancel',
        },
        {
          text: '네',
          onPress: () => this.openCustomerCenter('help_password'),
        },
      ],
      { cancelable: true },
    );
  }

  openCustomerCenter(type) {
    this.props.screenProps.modalNavigation.navigate('ModalWebViewShow', {
      url: `${ApiServer.CUSTOMER_INQUERY}/new?type=${type}&user=${JSON.stringify(this.state.user)}`,
      headerTitle: '고객센터',
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
      ErrorHandler(
        JSON.stringify(Object.keys(error.response.data).map(function (key, index) {
          return error.response.data[key][0];
        }))
      );
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

  handleBirthInput(input_birth) {
    const regExp = /^[(0-9)]{0,2}$/;
    if (!regExp.test(input_birth)) {
      ErrorHandler(
        '잘못된 출생년도 입니다. 2자리 숫자만 입력하세요.',
        () => this.setState({ input_birth: '' })
      );
    } else {
      this.setState({ input_birth });
    }
  }

  renderPasswordForm() {
    if (this.state.authenticated) {
      return (
        <View key={2}>
          <Row>
            <InputSingle
              placeholder={'새로운 비밀번호 (6자리 이상)'}
              value={this.state.input_password}
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
              value={this.state.input_password_confirmation}
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
              key={3}
              placeholder={'생년 두 자리 숫자를 입력해 주세요 (예: 92)'}
              value={this.state.input_birth}
              onChangeText={(input_birth) => this.handleBirthInput(input_birth)}
              onSubmitEditing={Keyboard.dismiss}
              returnKeyType={'done'}
              keyboardType={'phone-pad'}
              noButton
            />
          </Row>
          <Row>
            <InputToggle
              key={4}
              leftText={'여자'}
              leftClicked={this.state.left_clicked}
              rightText={'남자'}
              rightClicked={this.state.right_clicked}
              onLeftPress={() => this.setState({
                input_gender: 'F',
                left_clicked: true,
                right_clicked: false,
              }, Keyboard.dismiss)}
              onRightPress={() => this.setState({
                input_gender: 'M',
                left_clicked: false,
                right_clicked: true,
              }, Keyboard.dismiss)}
            />
          </Row>
          <Row>
            <TouchableOpacity
              onPress={() => this.openCustomerCenter('not_me')}
              style={{ margin: 10 }}>
              <Text note>{`혹시 ${this.state.user.name}님이 아니신가요 ?`}</Text>
            </TouchableOpacity>
          </Row>
          <Row>
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
              style={{ margin: 10 }}>
              <Text note>뒤로가기</Text>
            </TouchableOpacity>
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
        <Content padder noHeader>
          <Grid>
            <Row style={{ marginBottom: 20 }}>
              <Text xlarge>본인 확인</Text>
            </Row>
            {/*            <Row style={{
              justifyContent: 'flex-end',
              marginBottom: 20,
            }}>
              <View style={{
                width: Constant.deviceWidth / 2,
                height: 100,
              }}>
                {this.renderMessage()}
              </View>
            </Row>*/}
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
