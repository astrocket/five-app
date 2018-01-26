import React, { Component } from 'react';
import {
  View, TouchableOpacity,
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
      input_text: '',
      phone_number: '',
      pin_number: '',
      message: 0,
      status: 0,
    };
  }

  sendPin() {
    this.setState({ status: -1 });
    const url = `${ApiServer.PHONE}/send_sms`;
    const data = {
      phone_number: this.state.input_text,
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
      Toast.show({
        text: JSON.stringify(error.response.data),
        position: 'bottom',
        duration: 1500,
      });
    });
  }

  onSendPin(data) {
    const { message, success, phone_number } = data;
    if (success) {
      this.setState({
        status: 1,
        message: 1,
        phone_number: phone_number,
        input_text: '',
      });
    } else {
      this.setState({
        status: 0,
        message: message,
        input_text: '',
      });
    }
  }

  verifyPin() {
    this.setState({ status: -1 });
    const url = `${ApiServer.PHONE}/verify`;
    const data = {
      pin_phone: this.state.phone_number,
      pin_number: this.state.input_text,
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
      console.log(error.response);
      Toast.show({
        text: JSON.stringify(error.response.data),
        position: 'bottom',
        duration: 1500,
      });
    });
  }

  onVerifyPin(data) {
    const { success, message, exist } = data;
    const { navigation } = this.props;

    if (success) {
      var goTo = '';
      if (exist) {
        goTo = 'LogInForm';
      } else {
        goTo = 'SignUpForm';
      }
      navigation.dispatch(
        NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: goTo,
            params: { data: data },
          }),
        ],
      }))
    } else {
      this.setState({
        status: 3,
        message: message,
        pin_number: '',
      });
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
            key={this.state.status}
            placeholder={'휴대폰 번호를 입력해 주세요'}
            submitText={'확인'}
            autoFocus={true}
            value={''}
            onChangeText={(input_text) => this.setState({ input_text })}
            onSubmitPress={() => this.sendPin()}
            onSubmitEditing={() => this.sendPin()}
            keyboardType={'phone-pad'}
            returnKeyType={'done'}
          />
        );
      case 1:
        return (
          <InputSingle
            key={this.state.status}
            placeholder={'핀 번호를 입력해 주세요'}
            submitText={'확인'}
            autoFocus={true}
            value={''}
            onChangeText={(input_text) => this.setState({ input_text })}
            onSubmitPress={() => this.verifyPin()}
            onSubmitEditing={() => this.verifyPin()}
            keyboardType={'phone-pad'}
            returnKeyType={'done'}
          />
        );
      case 3:
        return (
          <View>
            <InputSingle
              key={this.state.status}
              placeholder={'핀 번호를 다시 입력해 주세요'}
              submitText={'확인'}
              autoFocus={true}
              value={''}
              onChangeText={(input_text) => this.setState({ input_text })}
              onSubmitPress={() => this.verifyPin()}
              onSubmitEditing={() => this.verifyPin()}
              keyboardType={'phone-pad'}
              returnKeyType={'done'}
            />
            <TouchableOpacity
              onPress={() => this.setState({
                message: 0, status: 0, phone_number: '', text_input: ''
              })}
              style={{ margin: 10 }}
            >
              <Text note>전화번호 다시 입력</Text>
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
            <Row>
              <Text xlarge>시작하기</Text>
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
