import React, { Component } from 'react';
import {
  View, RefreshControl,
} from 'react-native';
import {
  Container, Header, Content, Text, Spinner,
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import { NavBar } from '../../component/common';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('stores') @observer
export default class PageC extends Component {
  constructor(props) {
    super(props);
    this.app = this.props.stores.app;
    this.server = this.props.stores.server;
    this.state = {
      loading: true,
      refreshing: false,
    };
  }

  componentDidMount() {
    this.server.homeIndex((data) => this.setState(data))
      .then(() => this.setState({ loading: false }))
  }

  _onRefresh() {
    this.setState({ refreshing: true }, () => {
      this.server.homeIndex((data) => this.setState(data))
        .then(() => this.setState({ refreshing: false }))
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
