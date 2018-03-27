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
import {
  DeleteCategory,
} from '../../component/common/index';
import axios from 'axios';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('ApplicationStore') // Inject some or all the stores!
@observer
export default class Setting extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: '설정',
    ...Constant.FiveNavOptions,
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
        <Content>
          <List style={{
            borderBottomWidth: 1,
            borderBottomColor: '#eee',
          }}>
            <ListItem button
                      onPress={() => navigation.navigate('NoticeIndex')}>
              <Body>
              <Text>공지사항</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward"/>
              </Right>
            </ListItem>
            <ListItem button
                      onPress={() => navigation.navigate('InfoEdit', {
                        user: my_profile,
                      })}>
              <Body>
              <Text>프로필 관리</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward"/>
              </Right>
            </ListItem>
            <ListItem button
                      onPress={() => navigation.navigate('CategoryEdit', {
                        categories: this.props.navigation.state.params.categories,
                      })}>
              <Body>
              <Text>카테고리관리</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward"/>
              </Right>
            </ListItem>
            <ListItem button
                      onPress={() => navigation.navigate('AlarmEdit')}>
              <Body>
              <Text>허용여부 설정</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward"/>
              </Right>
            </ListItem>
            <ListItem button
                      onPress={() => navigation.navigate('AccountEdit')}>
              <Body>
              <Text>계정관리</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward"/>
              </Right>
            </ListItem>
            <ListItem button
                      onPress={() => this.props.screenProps.modalNavigation.navigate('ModalWebViewShow', {
                        url: `${ApiServer.COMPANY}/inquery?user=${JSON.stringify(this.props.ApplicationStore.my_profile)}`,
                        headerTitle: '고객센터',
                      })}>
              <Body>
              <Text>고객센터</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward"/>
              </Right>
            </ListItem>
            <ListItem button
                      onPress={() => this.props.screenProps.modalNavigation.navigate('ModalWebViewShow', {
                        url: `${ApiServer.COMPANY}/policy`,
                        headerTitle: '이용약관',
                      })}>
              <Body>
              <Text>이용약관</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward"/>
              </Right>
            </ListItem>
            <ListItem button
                      onPress={() => this.props.screenProps.modalNavigation.navigate('ModalWebViewShow', {
                        url: `${ApiServer.COMPANY}/privacy`,
                        headerTitle: '개인정보보호정책',
                      })}>
              <Body>
              <Text>개인정보보호정책</Text>
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
