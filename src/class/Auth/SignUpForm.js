import React, { Component } from 'react';
import {
  View, AsyncStorage, Keyboard,
} from 'react-native';
import {
  Container, Header, Content, Text, Spinner, Toast,
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import { NavigationActions } from 'react-navigation';
import { MainLargeTitle, InputSingle, InputToggle, BottomFullButton } from '../../component/common';
import axios from 'axios';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('ApplicationStore') // Inject some or all the stores!
@observer
export default class SignUpForm extends Component {

  static navigationOptions = ({ navigation }) => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      submiting: false,
      left_clicked: false,
      right_clicked: false,
      user: this.props.navigation.state.params.data.user,
      input_name: '',
      input_birth: '',
      input_password: '',
      input_gender: '',
      message: 0,
      status: 0,
      disableButton: true,
    };
  }

  trySignUp() {
    var regId = /^[a-zA-Z]{3,10}$/;
    if ( !regId.test( this.state.input_name ) ) {
      Toast.show({
        text:'잘못된 닉네임 형식 입니다. 3~10자리 영문만 입력하세요.',
        position: 'bottom',
        duration: 1500,
      });
      return false
    }

    var regExp = /^[(0-9)]{2}$/;
    if ( !regExp.test( this.state.input_birth ) ) {
      Toast.show({
        text:'잘못된 출생년도 입니다. 2자리 숫자만 입력하세요.',
        position: 'bottom',
        duration: 1500,
      });
      return false
    }

    if ( this.state.input_gender === '') {
      Toast.show({
        text:'성별이 선택되지 않았습니다.',
        position: 'bottom',
        duration: 1500,
      });
      return false
    }

    this.setState({ submiting: true });

    // rails server 에 로그인 시도하는 부분. 로그인 시도하고 서버에서 나온 결과값에 따라서 토스트메세지를 띄운다.
    axios.post(`${ApiServer.USERS}`, {
      user: {
        email: this.state.user.email,
        phone: this.state.user.phone,
        password: this.state.input_password,
        name: this.state.input_name,
        username: this.state.input_name,
        birthyear: this.state.input_birth,
        gender: this.state.input_gender
      }
    }).then((response) => {
      this.onSignUpSuccess(response.data);
    }).catch((error) => {
      this.setState({ submiting: false });

      Toast.show({
        text: JSON.stringify(error.response.data.errors.password),
        position: 'bottom',
        duration: 1500,
      });
    });
  }

  onSignUpSuccess(data) {
    AsyncStorage.multiSet([
      [ 'email',  data.email],
      [ 'token', data.authentication_token ],
      [ 'key', data.key ]
    ]).then(() => {
      this.props.ApplicationStore.setFirstAuth()
        .then(() => this.props.navigation.dispatch(
          NavigationActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({
                routeName: 'Hello',
              }),
            ],
          })));
    });
  }

  readyToSubmit() {
    var regId = /^[a-zA-Z]{3,10}$/;
    if ( !regId.test( this.state.input_name ) ) {
      this.setState({
        disableButton: true,
      });
      return false
    }

    var regExp = /^[(0-9)]{2}$/;
    if ( !regExp.test( this.state.input_birth ) ) {
      this.setState({
        disableButton: true,
      });
      return false
    }

    if ( this.state.input_gender === '') {
      this.setState({
        disableButton: true,
      });
      return false
    }

    this.setState({
      disableButton: false,
    })
  }

  renderButton() {
    if (this.state.submiting) {
      return <Spinner size="small" />;
    }

    return (
      <BottomFullButton
        onPress={() => this.trySignUp()}
        disabled={this.state.disableButton}
      >
        완료
      </BottomFullButton>
    );
  }

  render() {
    const { container, preLoading } = BaseStyle;
    const { navigation } = this.props;
    const { modalNavigation } = this.props.screenProps;

    return (
      <Container>
        <Content padder noHeader>
          <Grid>
            <MainLargeTitle
              title={'가입'}
            />
            <Row>
              <InputSingle
                placeholder={'닉네임 (영문 또는 숫자 3~10자 입력)'}
                value={''}
                autoFocus={true}
                onChangeText={(input_name) => {
                  this.setState({ input_name });
                  this.readyToSubmit();
                }}
                onSubmitEditing={Keyboard.dismiss}
                keyboardType={'email-address'}
                returnKeyType={'next'}
                noButton
              />
            </Row>
            <Row>
              <InputSingle
                placeholder={'출생년도 두 자리 숫 (예: 92)'}
                value={''}
                onChangeText={(input_birth) => {
                  this.setState({ input_birth });
                  this.readyToSubmit();
                }}
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
                onLeftPress={() => {
                    this.setState({input_gender: 'F', left_clicked: true, right_clicked: false});
                    this.readyToSubmit();
                }}
                onRightPress={() => {
                  this.setState({input_gender: 'M', left_clicked: false, right_clicked: true});
                  this.readyToSubmit();
                }}
              />
            </Row>
            <Row style={{ marginTop: 20}}>
              <InputSingle
                placeholder={'비밀번호 (6자리 이상)'}
                value={''}
                onChangeText={(input_password) => {
                  this.setState({ input_password });
                  this.readyToSubmit()
                }}
                onSubmitEditing={() => Keyboard.dismiss}
                returnKeyType={'done'}
                secureTextEntry
                noButton
              />
            </Row>
            <Row style={{ marginTop: 20}}>
              <Text>
                <Text>
                  {`"완료" `}
                </Text>
                <Text style={{ color: Constant.GreyColor}}>
                  {`버튼을 누르면 MYFIVE의 `}
                </Text>
                <Text
                  onPress={() => this.props.screenProps.modalNavigation.navigate('ModalWebViewShow', {
                    url: `${ApiServer.COMPANY}/policy`,
                    headerTitle: '이용약관'
                  })}
                >
                  이용약관
                </Text>
                <Text style={{ color: Constant.GreyColor}}>
                  {`과 `}
                </Text>
                <Text
                  onPress={() => this.props.screenProps.modalNavigation.navigate('ModalWebViewShow', {
                    url: `${ApiServer.COMPANY}/privacy`,
                    headerTitle: '개인정보보호정책'
                  })}
                >
                  개인정보보호정책
                </Text>
                <Text style={{ color: Constant.GreyColor}}>
                  에 동의하게 됩니다. 이용약관에는 마케팅 정보 수신에 대한 동의에 관한 내용이 포함되어 있으며, 회원은 언제든지 설정 메뉴에서 수신 거부로 변경할 수 있습니다.
                </Text>
              </Text>
            </Row>
          </Grid>
        </Content>
        <View style={{ marginBottom: this.keyboardHeight, height: 50, }}>
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