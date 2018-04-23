import React, { Component } from 'react';
import {
  View,
} from 'react-native';
import {
  Container, Header, Content, Card, CardItem, Text, Body
} from 'native-base';
import {
  Col,
  Row,
  Grid,
} from 'react-native-easy-grid';
import {
  NavBar,
} from '../../component/common';
import * as Constant from '../../config/Constant';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('stores') @observer
export default class NoticeShow extends Component {

  static navigationOptions = ({ navigation }) => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.app = this.props.stores.app;
    this.server = this.props.stores.server;
    this.state = {
      loading: false,
      notice: this.props.navigation.state.params.notice
    };
  }

  render() {
    const { container, preLoading } = BaseStyle;
    const { navigation } = this.props;

    return (
      <Container>
       <NavBar
          leftButton
          leftAsImage
          leftIcon={require('../../assets/images/back_icon_pink.png')}
          onPressLeft={() => navigation.goBack()}
          headerText={navigation.state.params.title}
        />
        <Content padder>
          <Card>
            <CardItem header>
              <Text>{this.state.notice.title}</Text>
            </CardItem>
            <CardItem>
              <Body>
              <Text>
                {this.state.notice.content}
              </Text>
              </Body>
            </CardItem>
            <CardItem footer>
              <Text note>{`마이파이브 운영팀 (${this.state.notice.created_at})`}</Text>
            </CardItem>
          </Card>
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
