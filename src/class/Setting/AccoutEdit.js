import React, { Component } from 'react';
import {
  StyleSheet, View, Keyboard, TouchableOpacity, AsyncStorage,
} from 'react-native';
import {
  Container, Header, Content, Text, Spinner, Input, Item, Button, Toast,
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import { BottomFullButton, InputSingle } from '../../component/common/index';
import {
  NavBar,
} from '../../component/common';
import * as Constant from '../../config/Constant';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('stores') @observer
export default class AccountEdit extends Component {

  static navigationOptions = ({ navigation }) => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.app = this.props.stores.app;
    this.server = this.props.stores.server;
    this.state = {
      loading: false,
      submiting: false,
      input_password: '',
      input_password_confirmation: '',
    };
  }

  postUserInfo() {
    const data = {
      user: {
        password: this.state.input_password,
        password_confirmation: this.state.input_password_confirmation,
      }
    };
    this.setState({ submiting: true }, () => {
      this.server.profileUpdate(data, (data) => this.setState(data), null, async (res) => {
        await this.app.setMyProfile(res.data)
          .then(() => this.props.navigation.goBack())
      }).then(() => this.setState({ submiting: false }));
    });
  }

  signOutAction() {
    this.setState({ loading: true }, () => {
      this.server.userSignOut();
    });
  }

  renderButton() {
    if (this.state.submiting) {
      return <Spinner size="small"/>;
    }

    return (
      <BottomFullButton onPress={() => this.postUserInfo()}>
        {'변경하기'}
      </BottomFullButton>
    );
  }

  render() {
    const { container, preLoading } = BaseStyle;
    const { navigation } = this.props;
    const { my_profile } = this.app;

    return (
      <Container>
       <NavBar
          leftButton
          leftAsImage
          leftIcon={require('../../assets/images/back_icon_pink.png')}
          onPressLeft={() => navigation.goBack()}
          headerText={`비밀번호 설정`}
        />
        <Content padder>
          <Grid>
            <Row>
              <InputSingle
                placeholder={'새로운 비밀번호 (6자리 이상)'}
                value={this.state.input_password}
                autoFocus={false}
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
                onSubmitEditing={() => this.postUserInfo()}
                returnKeyType={'done'}
                secureTextEntry
                noButton
              />
            </Row>
            <Row>
              <TouchableOpacity onPress={() => this.signOutAction()}>
                <View style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end',
                }}>
                  <Text style={signOutStyles.signOutText}>
                    SIGN OUT
                  </Text>
                </View>
              </TouchableOpacity>
            </Row>
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

const signOutStyles = StyleSheet.create({
  signOutText: {
    padding: 16,
    textAlign: 'right',
    color: 'lightgrey',
    fontSize: 15,
    fontWeight: 'bold',
  },
});