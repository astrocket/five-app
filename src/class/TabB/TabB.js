import React, { Component } from 'react';
import {
  View, FlatList,
} from 'react-native';
import {
  Container, Header, Content, Text,
  Spinner, Card, CardItem, Thumbnail,
  Button, Icon, Left, Body,
  Right, Segment, H1, H3,
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import {
  UserUnitRound, SmallButton, FollowerInfo, NotificationUnitBar, ShowMore,
} from '../../component/common';
import axios from 'axios';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import ApplicationStore from '../../mobx/ApplicationStore';
import PopupDialog from 'react-native-popup-dialog';
import MyFiveRestaurantModal from '../Restaurant/MyFiveRestaurantModal';

export default class TabB extends Component {

  static navigationOptions = ({ navigation }) => ({
    tabBarLabel: '5',
    tabBarIcon: ({ tintColor }) => (
      <Icon
        name="logo-apple"
        style={{
          fontSize: 25,
          color: tintColor,
        }}
      />
    ),
    title: 'MY FIVE 맛집',
    headerRight: (
      <Button onPress={() => navigation.navigate('Invitation')} transparent>
        <Icon
          name="md-person-add"
          style={{
            fontSize: 25,
            color: 'white',
          }}
        />
      </Button>
    ),
    ...Constant.FiveNavOptions,
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: true, //실서비스에서는 로딩 true로
      user: '',
      restaurant_followers_count: '',
      restaurant_followees_count: '',
      notifications: [],
      page: 1,
      page_loading: false,
      no_more: false,
    };
  }

  componentDidMount() {
    this.apiCall();
  }

  updateUser(user) {
    this.setState({
      user: user,
    })
  }

  apiCall() {
    const config = {
      headers: {
        'X-User-Email': ApplicationStore.email,
        'X-User-Token': ApplicationStore.token,
      },
    };
    axios.get(`${ApiServer.MY_PROFILE}?category=restaurant&page=${this.state.page}`, config)
      .then((response) => {
        this.setState({
          loading: false, //실서비스에서는 로딩 true로
          user: response.data.user,
          restaurant_followers_count: response.data.restaurant_followers_count,
          restaurant_followees_count: response.data.restaurant_followees_count,
          notifications: response.data.notifications,
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
    axios.get(`${ApiServer.MY_PROFILE}?category=restaurant&page=${this.state.page}`, config)
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

  renderRestaurantPopUp() {
    const { navigation } = this.props;
    return (
      <PopupDialog
        width={1}
        height={1}
        dismissOnTouchOutside={false}
        dialogStyle={{
          position: 'relative',
          top: -40,
          backgroundColor: 'transparent',
        }}
        ref={(tabBDialog) => {
          this.tabBDialog = tabBDialog;
        }}
      >
        <MyFiveRestaurantModal
          marginTop={80}
          marginLeft={20}
          marginRight={20}
          marginBottom={120}
          navigation={navigation}
          closePopUp={() => this.tabBDialog.dismiss()}
        />
      </PopupDialog>
    );
  }

  render() {
    const { preLoading } = BaseStyle;
    const { navigation } = this.props;

    return (
      <Container style={{ backgroundColor: '#FFFFFF' }}>
          <FlatList
            data={this.state.notifications}
            style={{paddingBottom: 15}}
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
            ListHeaderComponent={() =>
              <Grid style={{ padding: 10 }}>
                <Row style={{
                  height: 200,
                  alignItems: 'center',
                }}>
                  <Col style={{ alignItems: 'center' }}>
                    <UserUnitRound
                      id={this.state.user.id}
                      name={this.state.user.name}
                      image_url={this.state.user.image_url}
                      onPress={() => navigation.navigate('Setting', {
                        title: '설정',
                        user: this.state.user,
                        updateUser: (user) => this.updateUser(user)
                      })}
                      barWidth={70}
                      barHeight={70}
                      borderRadius={35}
                      marginRight={10}
                      fontSize={20}
                    />
                    <Text note>{this.state.user.introduce}</Text>
                  </Col>
                </Row>
                <Row style={{
                  height: 60,
                  alignItems: 'center',
                }}>
                  <Col style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <View>
                      <SmallButton
                        onPress={() => navigation.navigate('FollowIndex')}
                        title={'팔로우'}
                      />
                    </View>
                  </Col>
                  <Col style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <View>
                      <SmallButton
                        onPress={() => navigation.navigate('MyItemIndex')}
                        title={'담아두기'}
                      />
                    </View>
                  </Col>
                </Row>
                <Row style={{
                  height: 80,
                  alignItems: 'center',
                  marginBottom: 15,
                }}>
                  <Col style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <FollowerInfo
                      onPress={() => this.tabBDialog.show()}
                      category={'#맛집'}
                      followees={this.state.restaurant_followees_count}
                      followers={this.state.restaurant_followers_count}
                    />
                  </Col>
                  <Col style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <FollowerInfo
                      category={'#음악'}
                      followees={'24'}
                      followers={'299'}
                    />
                  </Col>
                  <Col style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <FollowerInfo
                      category={'#책'}
                      followees={'27'}
                      followers={'310'}
                    />
                  </Col>
                </Row>
                <Row>
                  <Text>친구소식</Text>
                </Row>
              </Grid>
            }
          />
        {this.renderRestaurantPopUp()}
        {this.state.loading &&
        <View style={preLoading}>
          <Spinner size="large"/>
        </View>
        }
      </Container>
    );
  }
}
