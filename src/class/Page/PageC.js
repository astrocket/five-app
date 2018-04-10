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
} from 'native-base';
import {
  Col,
  Row,
  Grid,
} from 'react-native-easy-grid';
import axios from 'axios';
import * as ApiServer from '../../config/ApiServer';
import { NavBar } from '../../component/common';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('ApplicationStore') // Inject some or all the stores!
@observer
export default class PageC extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      refreshing: false,
    };
  }

  async apiCall() {
    const config = {
      headers: {
        'X-User-Email': this.props.ApplicationStore.email,
        'X-User-Token': this.props.ApplicationStore.token,
      },
    };
    await axios.get(`${ApiServer.HOME_INDEX}?category=restaurant`, config)
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
        <NavBar
          rightButton
          rightIcon="ios-close-outline"
          onPressRight={() => navigation.goBack()}
          headerText="커스텀 헤더"
        />
        <Content refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }>
          <Text>안녕하세요</Text>
        </Content>
        {this.state.loading &&
        <View style={preLoading}>
          <Spinner size="large" />
        </View>
        }
      </Container>
    );
  }
}
