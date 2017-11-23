import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
} from 'react-native';
import {
  Container,
  Content,
  Text,
  Spinner,
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

export default class TabB extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
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
          <Text>꿈은 모든것의 원동력</Text>
          <TouchableOpacity onPress={() => rootNavigation.navigate('PageB', { title: '이한결의 꿈' })}>
            <Text note>어떻게 ?</Text>
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
