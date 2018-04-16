import React, { Component } from 'react';
import {
  View, TouchableOpacity, AsyncStorage, FlatList, Alert, Keyboard,
} from 'react-native';
import {
  Container, Header, Content, Text, Spinner,
  Item, Input, Icon, List, ListItem,
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import {
  FiveUnitBar, ElevenHeader, RowHeaderBar, EmptyBox, TabIcon,
} from '../../component/common';
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
export default class TabC extends Component {

  static navigationOptions = ({ navigation }) => ({
    tabBarLabel: '친구찾기',
    tabBarIcon: ({ tintColor }) => (
      <TabIcon
        tintColor={tintColor}
        imageGrey={require('../../assets/images/search_icon_grey.png')}
        imagePink={require('../../assets/images/search_icon_pink.png')}
      />
    ),
    header: null,
    ...Constant.FiveNavOptions,
  });

  render () {
    const { container, preLoading } = BaseStyle;

    return (
      <Container style={{ backgroundColor: '#FFFFFF' }}>
        <NavBar
          headerText={`친구찾기`}
        />
        <Grid style = {{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'gray' }}>
          <Col style = {{ width: 300, height: 300, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
            <Col style = {{ width: 240, height: 240, backgroundColor: 'white', margin: 16, padding: 32, borderColor: 'red',borderRadius: 16 }}></Col>
          </Col>
            <Text style = {{ color: 'red', padding: 16 }}>
              여기에 이용자 검색을 넣습니다
            </Text>
        </Grid>
      </Container>
    );
  }
}