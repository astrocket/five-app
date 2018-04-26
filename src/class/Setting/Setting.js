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
  NavBar,
} from '../../component/common';
import * as Images from '../../assets/images/Images';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('stores') @observer
export default class Setting extends Component {

  static navigationOptions = ({ navigation }) => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.app = this.props.stores.app;
    this.server = this.props.stores.server;
    this.state = {
      loading: false,
    };
  }

  render() {
    const { container, preLoading } = BaseStyle;
    const { navigation } = this.props;
    const { my_profile } = this.app;

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
                        url: `${ApiServer.COMPANY}/privacy_and_policy`,
                        headerTitle: '이용약관 등',
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
                        url: `${ApiServer.COMPANY}/inquery?user=${JSON.stringify(my_profile)}`,
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
