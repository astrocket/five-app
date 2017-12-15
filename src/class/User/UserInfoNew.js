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
  Item,
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
      user: this.props.navigation.state.params.user
    };
  }

  componentDidMount() {
    this.apiCall();
  }

  apiCall() {
    const config = {
      headers: {
        'X-User-Email': ApplicationStore.email,
        'X-User-Token': ApplicationStore.token,
      },
    };
    axios.get(ApiServer.HOME_INDEX, config)
      .then((response) => {
        console.log(response);
        this.setState({
          loading: false,
        });
      })
      .catch((error) => {
        console.log(error.response);
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
              placeholder={'한줄 자기소개 입력'}
              placeholderTextColor={'#eee'}
              onChangeText={(name) => this.setState({ name })}
              autoCapitalize={'none'}
              value={this.state.user.user_info}
              autoCorrect={false}
              autoFocus={true}
              multiline={false}
              style={{ fontSize: 15, padding: 10 }}
            />
          </Item>
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
