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
import * as Constant from '../../config/Constant';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('stores') @observer
export default class LogInForm extends Component {

  static navigationOptions = ({ navigation }) => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.app = this.props.stores.app;
    this.auth = this.props.stores.auth;
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
    this.setState({ loading: true }, async () => {
      await this.auth.userSignIn(this.state.user.email, this.state.input_text, (res) => this.app.onSignInSuccess(res.data), (e) => {
        this.setState({ input_text: '', loading: false }, () => this.auth.defaultErrorHandler(e))
      });
    });
  }

  renderInput() {
    switch (this.state.status) {
      case 0:
        return (
          <View key={0}>
            <InputSingle
              placeholder={'비밀번호를 다시 입력해 주세요'}
              noButton
              value={this.state.input_text}
              autoFocus={true}
              onChangeText={(input_text) => this.setState({ input_text })}
              onSubmitEditing={() => this.tryLogin()}
              returnKeyType={'done'}
              secureTextEntry
            />
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('FindPassword', { user: this.state.user })}
              style={{ margin: 10 }}
            >
              <Text note>  비밀번호가 기억나지 않아요</Text>
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
              <Text xlarge>로그인</Text>
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
