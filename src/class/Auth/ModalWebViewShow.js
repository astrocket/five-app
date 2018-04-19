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
import axios from 'axios';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('ApplicationStore') // Inject some or all the stores!
@observer
export default class ModalWebViewShow extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
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
          headerText={headerTitle}
        />
        <Grid>
          <Row>
            <WebView
              source={{ uri: url }}
              style={{ flex: 1 }}
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
