import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
} from 'react-native';
import {
  Container,
  Content,
  Spinner,
  Text,
  Button,
} from 'native-base';
import {
  Col,
  Row,
  Grid,
} from 'react-native-easy-grid';
import axios from 'axios';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import ApplicationStore from '../../mobx/ApplicationStore';

export default class TabA extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false, //실서비스에서는 로딩 true로
    };
  }

  componentDidMount() {
    console.log(this.props.navigation);
    this.apiCall();
  }

  apiCall() {
    const config = {
      headers: {
        'X-User-Email': ApplicationStore.email,
        'X-User-Token': ApplicationStore.token,
      },
    };
    console.log(ApiServer.HOME_INDEX);
    console.log(config);
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
    const { rootNavigation } = this.props.screenProps;

    return (
      <Container>
        <View style={container}>
          <Text>마이파이브 맛집 페이지</Text>
          <TouchableOpacity onPress={() => rootNavigation.navigate('FoodIndex', { title: '#맛집' })}>
            <Text note>맛집으로 고 !</Text>
          </TouchableOpacity>
        </View>
        {this.state.loading &&
        <View style={preLoading}>
          <Spinner size="large" />
        </View>
        }
      </Container>
    );
  }
}
