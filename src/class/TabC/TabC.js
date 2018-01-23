import React, { Component } from 'react';
import {
  View,
  TouchableOpacity, AsyncStorage,
} from 'react-native';
import {
  Container, Header, Content, Text, Spinner,
  Item, Input, Icon, Button,
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
import { observer, inject } from 'mobx-react/native';

@inject('ApplicationStore') // Inject some or all the stores!
@observer
export default class TabC extends Component {

  static navigationOptions = ({ navigation }) => ({
    tabBarLabel: '검색',
    tabBarIcon: ({ tintColor }) => (
      <Icon
        name="ios-search-outline"
        style={{
          fontSize: 25,
          color: tintColor,
        }}
      />
    ),
    title: '검색창',
    ...Constant.FiveNavOptions,
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }


  apiCall() {
    const config = {
      headers: {
        'X-User-Email': this.props.ApplicationStore.email,
        'X-User-Token': this.props.ApplicationStore.token,
      },
    };
    axios.get(ApiServer.HOME_INDEX, config)
      .then((response) => {
        this.setState({
          loading: false,
        });
      })
      .catch((error) => {
        console.log(error.response);
      });
  }

  signOutAction() {
    this.setState({ loading: true });

    axios.post(`${ApiServer.USERS}/sign_out`, {
      headers: {
        'X-User-Email': this.props.ApplicationStore.email,
        'X-User-Token': this.props.ApplicationStore.token,
      }
    }).then((response) => {
      AsyncStorage.multiRemove(['email', 'token', 'key'])
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

  render() {
    const { container, preLoading } = BaseStyle;
    const { navigation } = this.props;

    return (
      <Container>
        <Header searchBar rounded style={{paddingTop: 0, height: 56 }}>
          <Item>
            <Icon name="ios-search" />
            <Input
              placeholder="Search"
              autoCapitalize={'none'}
              autoCorrect={false}
            />
            <Icon name="ios-people" />
          </Item>
          <Button transparent>
            <Text>검색</Text>
          </Button>
        </Header>
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, flexDirection: 'column' }}>
          <Text>성수동 맛집</Text>
          <TouchableOpacity onPress={() => this.signOutAction()}>
            <Text>로그아웃</Text>
          </TouchableOpacity>
          <Text>성수동 맛집</Text>
          <Text>성수동 맛집</Text>
          <Text>성수동 맛집</Text>
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
