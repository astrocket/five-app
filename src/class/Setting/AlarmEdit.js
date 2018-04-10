import React, { Component } from 'react';
import {
  View,
} from 'react-native';
import {
  Container, Header, Content, List, ListItem, Text, Icon, Left, Body, Right, Switch, H2, Toast,
  Spinner,
} from 'native-base';

import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import axios from 'axios';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('ApplicationStore') // Inject some or all the stores!
@observer
export default class AlarmEdit extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: '허용여부 설정',
    ...Constant.FiveNavOptions,
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: false, //실서비스에서는 로딩 true로
    };
  }

  render() {
    const { container, preLoading } = BaseStyle;
    const { navigation } = this.props;
    const { my_profile } = this.props.ApplicationStore;

    return (
      <Container style={{ backgroundColor: '#FFFFFF' }}>
        <Content>
          <List style={{
            borderBottomWidth: 1,
            borderBottomColor: '#eee',
          }}>
            <ListItem>
              <Body>
              <Text>알림 허용</Text>
              </Body>
              <Right>
                <Switch value={true}/>
              </Right>
            </ListItem>
            <ListItem>
              <Body>
              <Text>연락처 접근 권한</Text>
              </Body>
              <Right>
                <Switch value={true}/>
              </Right>
            </ListItem>
            <ListItem>
              <Body>
              <Text>마케팅 정보 수신</Text>
              </Body>
              <Right>
                <Switch value={true}/>
              </Right>
            </ListItem>
          </List>
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
