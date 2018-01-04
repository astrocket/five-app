import React, { Component } from 'react';
import {
  View, Dimensions, Platform, FlatList,
} from 'react-native';
import {
  Container, Header, Content, Text, Spinner,
  Thumbnail,
  ListItem,
  Left,
  Body,
  Right,
  H3, Icon
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import { NotificationUnitBar, ShowMore } from '../component/common';
import axios from 'axios';
import * as ApiServer from './ApiServer';
import BaseStyle from './BaseStyle';
import ApplicationStore from '../mobx/ApplicationStore';

export default class CustomDrawer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true, //실서비스에서는 로딩 true로
      notifications: [],
      page: 1,
      page_loading: false,
      no_more: false,
    };
  }

  componentDidMount() {
    this.apiCall();
  }

  apiCall() {
    const config = {
      headers: {
        'X-User-Email': ApplicationStore.email,
        'X-User-Token': ApplicationStore.token,
      },
    };
    axios.get(`${ApiServer.NOTIFICATIONS}?page=${this.state.page}`, config)
      .then((response) => {
        this.setState({
          loading: false,
          notifications: response.data,
        });
      })
      .catch((error) => {
        console.log(error.response);
      });
  }

  pageCall() {
    const config = {
      headers: {
        'X-User-Email': ApplicationStore.email,
        'X-User-Token': ApplicationStore.token,
      },
    };
    axios.get(`${ApiServer.NOTIFICATIONS}?page=${this.state.page}`, config)
      .then((response) => {
        if (response.data.notifications === undefined || response.data.notifications.length === 0) {
          this.setState({ no_more: true });
        }
        this.setState({
          notifications: [ ...this.state.notifications, ...response.data.notifications ],
          page_loading: false,
        });
      }).catch((error) => {
      console.log(error.response);
    });
  }

  nextPage() {
    this.setState({
      page: this.state.page + 1,
      page_loading: true,
    }, () => {
      this.pageCall();
    });
  }

  render() {
    const { container, preLoading } = BaseStyle;
    const { navigation } = this.props;

    const deviceHeight = Dimensions.get('window').height;
    const deviceWidth = Dimensions.get('window').width;
    const platform = Platform.OS;
    const isIphoneX = platform === 'ios' && deviceHeight === 812 && deviceWidth === 375;


    return (
      <Container>
        <Grid>
          <Row style={{
            paddingTop: platform === "ios" ? (isIphoneX ? 39 : 15) : 0,
            height: 100,
            justifyContent: 'center',
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor: '#c9c9c9'
          }}>
            <Text medium style={{ textAlign: 'center' }}>알림</Text>
          </Row>
          <Row style={{ justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column' }}>
            <FlatList
              data={this.state.notifications}
              style={{paddingBottom: 10}}
              renderItem={({ item }) => (
                <NotificationUnitBar
                  id={item.id}
                  user={item.from_user}
                  title={item.title}
                  created_at={item.created_at}
                  onPress={() => navigation.navigate('UserShow', {
                    title: item.from_user.name,
                    user: item.from_user,
                  })}
                />
              )}
              keyExtractor={item => 'notifications-list-' + item.id}
              ListFooterComponent={
                () =>
                  <ShowMore
                    onPress={() => this.nextPage()}
                    moreText={'더보기'}
                    overText={'끝'}
                    no_more={this.state.no_more}
                    page_loading={this.state.page_loading}
                  />
              }
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
