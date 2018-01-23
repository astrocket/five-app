import React, { Component } from 'react';
import {
  View, TouchableOpacity, AsyncStorage,
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
export default class LogInForm extends Component {

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
      user: this.props.navigation.state.params.data.user,
      text_input: '',
      password: '',
      message: 0,
      status: 0,
    };
  }

  tryLogin() {
    this.setState({ loading: true });

    // rails server 에 로그인 시도하는 부분. 로그인 시도하고 서버에서 나온 결과값에 따라서 토스트메세지를 띄운다.
    axios.post(`${ApiServer.USERS}/sign_in`, {
      user: {
        email: this.state.user.email,
        password: this.state.input_text
      }
    }).then((response) => {
      this.onLoginSuccess(response.data);
    }).catch((error) => {
      this.setState({ loading: false });
        Toast.show({
          text: JSON.stringify(error.response.data.errors.title),
          position: 'bottom',
          duration: 1500,
        });
      });
  }

  onLoginSuccess(data) {
    AsyncStorage.multiSet([
      [ 'email',  data.email],
      [ 'token', data.authentication_token ],
      [ 'key', data.key ]
    ]).then(() => {
      this.props.ApplicationStore.setAuthInfo();
    });
  }

  renderMessage() {
    switch (this.state.message) {
      case 0:
        return <Text key={0} note>{this.state.user.name}님, 어서오세요 !{'\n'}비밀번호를 입력하면 MYFIVE를{'\n'}다시 시작할 수 있어요.</Text>;
      default:
        return <Text key={this.state.message} note>{this.state.message}</Text>;
    }
  }

  renderInput() {
    switch (this.state.status) {
      case 0:
        return (
          <View key={0}>
            <InputSingle
              placeholder={'비밀번호를 다시 입력해 주세요'}
              submitText={'확인'}
              value={''}
              autoFocus={true}
              onChangeText={(input_text) => this.setState({ input_text })}
              onSubmitPress={() => this.tryLogin()}
              returnKeyType={'done'}
              secureTextEntry
            />
            <TouchableOpacity
              onPress={() => this.props.screenProps.modalNavigation.navigate('ModalWebViewShow', {
                url: `${ApiServer.FIVE_STORY}/31`,
                headerTitle: '비밀번호 찾기'
              })}
              style={{ margin: 10 }}
            >
              <Text note>비밀번호가 기억나지 않아요</Text>
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
        <Content padder keyboardShouldPersistTaps={'always'}>
          <Grid>
            <Row>
              <Text xlarge>로그인</Text>
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
