import React, { Component } from 'react';
import {
  View,
} from 'react-native';
import {
  Container,
  Header,
  Content,
  Text,
  Spinner,
  Input,
  Item, Button,
} from 'native-base';
import {
  Col,
  Row,
  Grid,
} from 'react-native-easy-grid';
import axios from 'axios';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import ApplicationStore from '../../mobx/ApplicationStore';

export default class UserInfoNew extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: '한줄 소개',
    ...Constant.FiveNavOptions,
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: false, //실서비스에서는 로딩 true로
      user: this.props.navigation.state.params.user,
      introduce: ''
    };
  }


  onUploadSuccess(data) {
    this.props.navigation.state.params.updateUser(data);
    this.setState({
      loading: false,
    }, () => this.props.navigation.goBack() );
  }

  postUserInfo() {
    const data = new FormData();

    data.append("user[introduce]", this.state.introduce);

    const header = {
      headers: {
        'X-User-Email': ApplicationStore.email,
        'X-User-Token': ApplicationStore.token,
        'Content-Type': 'multipart/form-data;',
      },
    };

    axios.post(`${ApiServer.MY_PROFILE}/update_user`, data, header)
      .then((response) => {
        this.onUploadSuccess(response.data); // 업로드 후 유저를 통째로 리턴시킨다.
      }).catch((error) => {
      Toast.show({
        text: JSON.stringify(error.response),
        position: 'bottom',
        duration: 1500,
      });
    });
  }

  render() {
    const { container, preLoading } = BaseStyle;
    const { navigation } = this.props;

    return (
      <Container>
        <Content padder>
          <Item>
            <Input
              placeholder={this.state.user.introduce}
              placeholderTextColor={'#eee'}
              onChangeText={(introduce) => this.setState({ introduce })}
              autoCapitalize={'none'}
              autoCorrect={false}
              autoFocus={true}
              multiline={false}
              style={{ fontSize: 15, padding: 10 }}
            />
          </Item>
          <Button onPress={() => this.postUserInfo()}>
            <Text>제출</Text>
          </Button>
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
