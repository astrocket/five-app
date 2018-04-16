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
import {
  UserUnitRound, FivesBar, NavBar,
} from '../../component/common';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('ApplicationStore') // Inject some or all the stores!
@observer
export default class AlarmEdit extends Component {

  static navigationOptions = ({ navigation }) => ({
    header: null,
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
       <NavBar
          leftButton
          leftAsImage
          leftIcon={require('../../assets/images/back_icon_pink.png')}
          onPressLeft={() => navigation.goBack()}
          headerText={`허용권한 설정`}
        />
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