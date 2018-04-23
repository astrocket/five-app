import React, { Component } from 'react';
import {
  View, WebView,
} from 'react-native';
import {
  Container, Header, Content, Text, Spinner,
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import { NavBar } from '../../component/common';
import * as Constant from '../../config/Constant';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('stores') @observer
export default class ModalWebViewShow extends Component {

  constructor(props) {
    super(props);
    this.app = this.props.stores.app;
    this.server = this.props.stores.server;
    this.state = {
      loading: true,
    };
  }

  render() {
    const { container, preLoading } = BaseStyle;
    const { modalNavigation } = this.props.screenProps;
    const { url, headerTitle }= this.props.screenProps.modalNavigation.state.params;

    return (
      <Container>
        <NavBar
          leftButton
          leftAsImage
          leftIcon={require('../../assets/images/cancel_icon_grey.png')}
          onPressLeft={() => modalNavigation.goBack()}
          mediaPlaybackRequiresUserAction={false}
          headerText={headerTitle}
        />
        <Grid>
          <Row>
            <WebView
              source={{ uri: url }}
              style={{ flex: 1 }}
              onLoadEnd={() => this.setState({
                loading: false
              })}
            />
          </Row>
        </Grid>
        {this.state.loading &&
        <View style={preLoading}>
          <Spinner size="large"/>
        </View>
        }
      </Container>
    );
  }
}
