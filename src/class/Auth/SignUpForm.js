import React, { Component } from 'react';
import {
  View, Keyboard,
} from 'react-native';
import {
  Container, Header, Content, Text, Spinner, Toast,
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import { NavigationActions } from 'react-navigation';
import { MainLargeTitle, InputSingle, InputToggle, BottomFullButton } from '../../component/common';
import * as Constant from '../../config/Constant';
import BaseStyle from '../../config/BaseStyle';
import { ErrorHandler} from '../../config/helpers';
import { observer, inject } from 'mobx-react/native';

@inject('stores') @observer
export default class SignUpForm extends Component {

  static navigationOptions = ({ navigation }) => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.app = this.props.stores.app;
    this.auth = this.props.stores.auth;
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
    let regId = /^[a-zA-Z0-9]{3,10}$/;
    if ( !regId.test( this.state.input_name ) ) {
      ErrorHandler(
        '마이파이브 닉네임은 3~10자리 영문과 숫자로만 이용할 수 있어요.',
        () => this.setState({ input_name: '' })
      );
      return false
    }

    let regExp = /^[(0-9)]{2}$/;
    if ( !regExp.test( this.state.input_birth ) ) {
      ErrorHandler('"92"와 같이 두 자리 숫자만으로 충분해요!',
        () => this.setState({ input_birth: '' }));
      return false
    }

    if ( this.state.input_gender === '') {
      ErrorHandler('성별을 선택해 주세요.',
        () => this.setState({ input_gender: '' }));
      return false
    }

    const data = {
      user: {
        email: this.state.user.email,
        phone: this.state.user.phone,
        password: this.state.input_password,
        name: this.state.input_name,
        username: this.state.input_name,
        birthyear: this.state.input_birth,
        gender: this.state.input_gender
      }
    };

    const dispatch = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({routeName: 'Hello'}),
      ],
    });

    this.setState({ submiting: true }, () => {
      this.auth.userCreate(data, (res) => {
        this.app.onSignUpSuccess(res.data)
          .then(() => this.props.navigation.dispatch(dispatch))
      }).then(() => {
        this.setState({ submiting: false });
      })
    });
  }

  renderButton() {
    if (this.state.submiting) {
      return <Spinner size="small" />;
    }

    return (
      <BottomFullButton
        onPress={() => this.trySignUp()}
      >
        완료
      </BottomFullButton>
    );
  }

  handleInputName(input_name) {
    let regId = /^[a-zA-Z0-9]{0,10}$/;
    if ( !regId.test( input_name ) ) {
      ErrorHandler(
        '마이파이브 닉네임은 3~10자리 영문과 숫자로만 이용할 수 있어요.',
        () => this.setState({ input_name: '' })
      );
      return false
    } else {
      this.setState({ input_name })
    }
  }

  handleInputBirth(input_birth) {
    let regExp = /^[(0-9)]{0,2}$/;
    if ( !regExp.test( input_birth ) ) {
      ErrorHandler('"92"와 같이 두 자리 숫자만으로 충분해요!',
        () => this.setState({ input_birth: '' }));
      return false
    } else {
      this.setState({ input_birth })
    }
  }

  renderButton() {
    if (this.state.submiting) {
      return <Spinner size="small" />;
    }

    return (
      <BottomFullButton
        onPress={() => this.trySignUp()}
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
                placeholder={'닉네임 (영문 또는 숫자 3~10자)'}
                value={this.state.input_name}
                autoFocus={true}
                onChangeText={(input_name) => this.handleInputName(input_name)}
                onSubmitEditing={Keyboard.dismiss}
                keyboardType={'email-address'}
                returnKeyType={'next'}
                noButton
              />
            </Row>
            <Row>
              <Col size={50} style={{ marginRight: 16 }}>
                <InputSingle
                placeholder={'생년 (예: "92")'}
                value={this.state.input_birth}
                onChangeText={(input_birth) => this.handleInputBirth(input_birth)}
                onSubmitEditing={Keyboard.dismiss}
                returnKeyType={'next'}
                keyboardType={'numeric'}
                noButton
                />
              </Col>
              <Col size={50}>
                <InputToggle
                leftText={'여자'}
                leftClicked={this.state.left_clicked}
                rightText={'남자'}
                rightClicked={this.state.right_clicked}
                onLeftPress={() => {
                    this.setState({input_gender: 'F', left_clicked: true, right_clicked: false});
                }}
                onRightPress={() => {
                  this.setState({input_gender: 'M', left_clicked: false, right_clicked: true});
                }}
                />
              </Col>
            </Row>
            <Row style={{ marginTop: 0}}>
              <InputSingle
                placeholder={'비밀번호 (6자리 이상)'}
                value={this.state.input_password}
                onChangeText={(input_password) => {
                  this.setState({ input_password });
                }}
                onSubmitEditing={() => Keyboard.dismiss}
                returnKeyType={'done'}
                secureTextEntry
                noButton
              />
            </Row>
            <Row style={{ margin: 0, marginTop: 200, padding: 16, borderRadius: 12, backgroundColor: '#fafafa' }}>
              <Text style={{ fontSize: 4 }}>
                <Text>
                  {`완료`}
                </Text>
                <Text style={{ color: Constant.GreyColor}}>
                  {`버튼을 누르면 MYFIVE의 `}
                </Text>
                <Text
                  onPress={() => modalNavigation.navigate('ModalWebViewShow', {
                    url: `https://myfivecs.blogspot.kr/`,
                    headerTitle: '이용약관'
                  })}
                >
                  이용약관
                </Text>
                <Text style={{ color: Constant.GreyColor}}>
                  {`과 `}
                </Text>
                <Text
                  onPress={() => modalNavigation.navigate('ModalWebViewShow', {
                    url: `https://myfivecs.blogspot.kr/`,
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
