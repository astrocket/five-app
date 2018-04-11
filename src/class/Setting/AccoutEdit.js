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
import axios from 'axios';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('ApplicationStore') // Inject some or all the stores!
@observer
export default class AccountEdit extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: '비밀번호 설정',
    ...Constant.FiveNavOptions,
  });

  constructor(props) {
    super(props);
    const { my_profile } = this.props.ApplicationStore;
    this.state = {
      loading: false, //실서비스에서는 로딩 true로
      submiting: false,
      input_password: '',
      input_password_confirmation: '',
    };
  }

  postUserInfo() {
    this.setState({ submiting: true });

    const header = {
      headers: {
        'X-User-Email': this.props.ApplicationStore.email,
        'X-User-Token': this.props.ApplicationStore.token,
      },
    };

    axios.post(`${ApiServer.MY_PROFILE}/update_user`, {
      user: {
        password: this.state.input_password,
        password_confirmation: this.state.input_password_confirmation,
      }
    }, header)
      .then((response) => {
        this.onUploadSuccess(response.data); // 업로드 후 유저를 통째로 리턴시킨다.
      }).catch((error) => {
      this.setState({
        submiting: false,
      });
      Toast.show({
        text: JSON.stringify(error.response.data),
        position: 'bottom',
        duration: 1500,
      });
    });
  }

  onUploadSuccess(data) {
    Toast.show({
      text: '비밀번호가 변경되었습니다.',
      position: 'bottom',
      duration: 1500,
    });
    this.props.ApplicationStore.setMyProfile(data).then(() => {
      this.setState({
        submiting: false,
        loading: false,
      }, () => this.props.navigation.goBack());
    });
  }


  signOutAction() {
    this.setState({ loading: true });

    axios.post(`${ApiServer.USERS}/sign_out`, {
      headers: {
        'X-User-Email': this.props.ApplicationStore.email,
        'X-User-Token': this.props.ApplicationStore.token,
      },
    }).then((response) => {
      AsyncStorage.multiRemove([ 'email', 'token', 'key' ])
        .then(() => {
          this.props.ApplicationStore.signOut();
        });
    }).catch((error) => {
      Toast.show({
        text: JSON.stringify(error.response.data),
        position: 'bottom',
        duration: 1500,
      });
    });
  }

  renderButton() {
    if (this.state.submiting) {
      return <Spinner size="small"/>;
    }

    return (
      <BottomFullButton onPress={() => this.postUserInfo()}>
        변경 완료
      </BottomFullButton>
    );
  }

  render() {
    const { container, preLoading } = BaseStyle;
    const { navigation } = this.props;
    const { my_profile } = this.props.ApplicationStore;

    return (
      <Container>
        <Content padder>
          <Grid>
            <Row>
              <InputSingle
                placeholder={'새로운 비밀번호 (6자리 이상)'}
                value={''}
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
                value={''}
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