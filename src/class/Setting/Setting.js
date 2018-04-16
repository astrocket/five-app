import React, { Component } from 'react';
import {
  StyleSheet, View,
} from 'react-native';
import {
  Container, Header, Content, List, ListItem, Text, Icon, Left, Body, Right, Switch, H2, Toast,
  Spinner,
} from 'native-base';

import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import {
  DeleteCategory,
} from '../../component/common/index';
import axios from 'axios';
import {
  UserUnitRound, FivesBar, NavBar,
} from '../../component/common';
import * as Images from '../../assets/images/Images';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('ApplicationStore') // Inject some or all the stores!
@observer
export default class Setting extends Component {

  static navigationOptions = ({ navigation }) => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: true, //실서비스에서는 로딩 true로
    };
  }

  componentDidMount() {
    this.apiCall();
  }

  apiCall() {
    const config = {
      headers: {
        'X-User-Email': this.props.ApplicationStore.email,
        'X-User-Token': this.props.ApplicationStore.token,
      },
    };
    axios.get(`${ApiServer.MY_PROFILE}/me`, config)
      .then((response) => {
        this.props.ApplicationStore.setMyProfile(response.data).then(() => {
          this.setState({
            loading: false,
          });
        });
      })
      .catch((error) => {
        console.log(error.response);
      });
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
          headerText={`설정`}
        />
        <Content>
          <List>
            <ListItem itemDivider>
              <Text style={noticeStyles.noticeHeader}>알림</Text>
            </ListItem>
            <ListItem icon
                      onPress={() => navigation.navigate('NoticeIndex')}>
              <Left>
                <Icon name="notifications"/>
              </Left>
              <Body>
              <Text style={noticeStyles.noticeContent}>공지사항</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
            <ListItem icon
                      onPress={() => this.props.screenProps.modalNavigation.navigate('ModalWebViewShow', {
                        url: `https://myfivecs.blogspot.kr/`,
                        headerTitle: '이용약관',
                      })}>
              <Left>
                <Icon name="paper" />
              </Left>
              <Body>
                <Text style={noticeStyles.noticeContent}>이용약관 및 개인정보보호정책</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward"/>
              </Right>
            </ListItem>
            <ListItem icon
                      onPress={() => this.props.screenProps.modalNavigation.navigate('ModalWebViewShow', {
                        url: `${ApiServer.COMPANY}/inquery?user=${JSON.stringify(this.props.ApplicationStore.my_profile)}`,
                        headerTitle: '제안 보내기',
                      })}>
              <Left>
                <Icon name="paper-plane" />
              </Left>
              <Body>
               <Text style={noticeStyles.noticeContent}>베타 서비스 개선 제안</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward"/>
              </Right>
            </ListItem>
            <ListItem itemDivider>
              <Text style={noticeStyles.noticeHeader}>나의 정보 관리</Text>
            </ListItem>
            <ListItem icon
                      onPress={() => navigation.navigate('InfoEdit', {
                        user: my_profile,
                      })}>
              <Left>
                <Icon name="person"/>
              </Left>
              <Body>
              <Text style={noticeStyles.noticeContent}>프로필 변경</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward"/>
              </Right>
            </ListItem>
            <ListItem icon
                      onPress={() => navigation.navigate('CategoryEdit')}>
              <Left>
                <Icon name="bookmarks"/>
              </Left>
              <Body>
              <Text style={noticeStyles.noticeContent}>참여한 주제 변경</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward"/>
              </Right>
            </ListItem>
            <ListItem itemDivider>
              <Text style={noticeStyles.noticeHeader}>기능 관리</Text>
            </ListItem>
            <ListItem icon
                      onPress={() => navigation.navigate('AlarmEdit')}>
              <Left>
                <Icon name="grid"/>
              </Left>
              <Body>
              <Text style={noticeStyles.noticeContent}>허용권한 설정</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward"/>
              </Right>
            </ListItem>
            <ListItem icon
                      onPress={() => navigation.navigate('AccountEdit')}>
              <Left>
                <Icon name="settings"/>
              </Left>
              <Body>
              <Text style={noticeStyles.noticeContent}>비밀번호 설정</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward"/>
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

const noticeStyles = StyleSheet.create({
  noticeHeader: {
    color: '#4a4a4a',
    fontWeight: 'bold',
    fontSize: 15,
  },
  noticeContent: {
    color: 'black',
    fontWeight: 'normal',
    fontSize: 16,
  },
});
