import React, { Component } from 'react';
import {
  View, TouchableOpacity, Keyboard,
} from 'react-native';
import {
  Container, Header, Content, Text, Spinner, Item, Input, Toast,
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import { NavigationActions } from 'react-navigation';
import { InputSingle } from '../../component/common';
import axios from 'axios';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import { ErrorHandler} from '../../config/helpers';
import { observer, inject } from 'mobx-react/native';

@inject('ApplicationStore') // Inject some or all the stores!
@observer
export default class StartForm extends Component {

  static navigationOptions = ({ navigation }) => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      input_phone: '',
      input_pin: '',
      phone_number: '',
      pin_number: '',
      message: 0,
      status: 0,
      misTypeCounter: 0,
    };
  }

  sendPin() {
    var regExp =  /^\d{3}\d{3,4}\d{4}$/;
    if (!regExp.test(this.state.input_phone)) {
      ErrorHandler(
        '잘못된 휴대폰 번호입니다. 01012341234 와 같은 숫자만 입력하세요.',
        () => this.setState({ input_phone: ''})
      );
      return false;
    }

    this.setState({ status: -1 });
    const url = `${ApiServer.PHONE}/send_sms`;
    const data = {
      phone_number: this.state.input_phone,
    };
    const header = {
      headers: {
        'X-User-Email': this.props.ApplicationStore.email,
        'X-User-Token': this.props.ApplicationStore.token,
      },
    };

    axios.post(url, data, header)
      .then((response) => {
        this.onSendPin(response.data); // 업로드 후 유저를 통째로 리턴시킨다.
      }).catch((error) => {
      ErrorHandler(JSON.stringify(error.response.data));
    });
  }

  onSendPin(data) {
    const { message, success, phone_number, exist } = data;
    if (success) {
      var goTo = '';
      if (exist) {
        goTo = 'LogInForm';
        this.props.navigation.dispatch(
          NavigationActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({
                routeName: goTo,
                params: { data: data },
              }),
            ],
          }));
      } else {
        this.setState({
          status: 1,
          message: 1,
          phone_number: phone_number,
          input_pin: '',
        });
      }
    } else {
      this.setState({
        status: 0,
        message: message,
        input_pin: '',
      });
      ErrorHandler(message);
    }
  }

  verifyPin() {
    var regExp = /^[(0-9)]{4}$/;
    if (!regExp.test(this.state.input_pin)) {
      ErrorHandler(
        '잘못된 핀 번호입니다. 4자리 숫자만 입력하세요.',
        () => this.setState({ input_pin: ''})
      );
      return false;
    }

    this.setState({ status: -1 });
    const url = `${ApiServer.PHONE}/verify`;
    const data = {
      pin_phone: this.state.phone_number,
      pin_number: this.state.input_pin,
    };
    const header = {
      headers: {
        'X-User-Email': this.props.ApplicationStore.email,
        'X-User-Token': this.props.ApplicationStore.token,
      },
    };

    axios.post(url, data, header)
      .then((response) => {
        this.onVerifyPin(response.data); // 업로드 후 유저를 통째로 리턴시킨다.
      }).catch((error) => {
      ErrorHandler(JSON.stringify(error.response.data));
    });
  }

  onVerifyPin(data) {
    const { success, message, exist } = data;
    const { navigation } = this.props;

    if (success) {
      navigation.dispatch(
        NavigationActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({
              routeName: 'SignUpForm',
              params: { data: data },
            }),
          ],
        }));
    } else {
      if (this.state.misTypeCounter > 0) {
        navigation.dispatch(
          NavigationActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({
                routeName: 'Main',
              }),
            ],
          }));
      } else {
        this.setState({
          status: 3,
          misTypeCounter: this.state.misTypeCounter + 1,
          message: message,
          pin_number: '',
        });
        ErrorHandler(
          message,
          () => this.setState({ input_pin: ''})
        );
      }
    }
  }

  renderMessage() {
    switch (this.state.message) {
      case 0:
        return <Text note>어서오세요 !{'\n'}MYFIVE는 별도 아이디 없이{'\n'}휴대폰 번호만 있으면{'\n'}시작할 수 있어요.</Text>;
      case 1:
        return <Text
          note>입력하신{'\n'}{this.state.phone_number.substring(0, 3)}-{this.state.phone_number.substring(3, 7)}-{this.state.phone_number.substring(7, 11)}로{'\n'}문자
          메시지 인증번호를{'\n'}보내드렸어요.</Text>;
      default:
        return <Text note>{this.state.message}</Text>;
    }
  }

  renderInput() {
    switch (this.state.status) {
      case 0:
        return (
          <InputSingle
            key={0}
            placeholder={`휴대폰 번호를 입력해 주세요('-' 제외)`}
            noButton
            autoFocus={true}
            value={this.state.input_phone}
            onChangeText={(input_phone) => this.setState({ input_phone })}
            onSubmitEditing={() => this.sendPin()}
            keyboardType={'phone-pad'}
            returnKeyType={'done'}
          />
        );
      case 1:
        return (
          <View key={12}>
            <InputSingle
              key={1}
              placeholder={'문자 메시지로 받은 인증번호를 입력해 주세요'}
              noButton
              autoFocus={true}
              value={this.state.input_pin}
              onChangeText={(input_pin) => this.setState({ input_pin })}
              onSubmitEditing={() =>
                this.verifyPin()
              }
              keyboardType={'phone-pad'}
              returnKeyType={'done'}
            />
            <TouchableOpacity
              onPress={() => this.setState({
                message: 0,
                status: 0,
                input_phone: '',
                input_pin: '',
                phone_number: '',
                misTypeCounter: 0,
              })}
              style={{ margin: 10 }}
            >
              <Text note>인증번호를 받지 못했을 때</Text>
            </TouchableOpacity>
          </View>
        );
      case 3:
        return (
          <View key={13}>
            <InputSingle
              key={3}
              placeholder={'문자 메시지로 받은 인증번호를 다시 입력해 주세요'}
              noButton
              autoFocus={true}
              value={this.state.input_pin}
              onChangeText={(input_pin) => this.setState({ input_pin })}
              onSubmitEditing={() => this.verifyPin()}
              keyboardType={'phone-pad'}
              returnKeyType={'done'}
            />
            <TouchableOpacity
              onPress={() => this.setState({
                message: 0,
                status: 0,
                input_phone: '',
                input_pin: '',
                phone_number: '',
                misTypeCounter: 0,
              })}
              style={{ margin: 10 }}
            >
              <Text note>인증번호를 받지 못했을 때</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return (
          <Spinner key={this.state.status} size="large"/>
        );
    }
  }

  render() {
    const { container, preLoading } = BaseStyle;
    const { navigation } = this.props;

    return (
      <Container>
        <Content padder noHeader keyboardShouldPersistTaps={'always'}>
          <Grid>
            <Row style={{marginBottom: 20}}>
              <Text xlarge>시작하기</Text>
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
          </Grid>
          {this.renderInput()}
        </Content>
        {this.state.loading &&
        <View style={preLoading}>
          <Spinner size="large"/>
        </View>
        }
      </Container>
    );
  }
}
