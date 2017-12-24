import React, { Component } from 'react';
import {
  View, Image,
} from 'react-native';
import {
  Container, Header, Content, Text, Spinner, Card,
  CardItem, Thumbnail, Button, Icon, Left, Body,
  Right, Segment, H1, Toast,
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import axios from 'axios';
import {
  FollowUserButton, UserUnitRound, FollowerButton,
} from '../../component/common';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import ApplicationStore from '../../mobx/ApplicationStore';
import PopupDialog from 'react-native-popup-dialog';
import UserFiveRestaurantModal from '../User/UserFiveRestaurantModal';

export default class UserShow extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.title,
    ...Constant.FiveNavOptions,
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: false, //실서비스에서는 로딩 true로
      user: '',
      restaurant_followers_count: '',
      restaurant_followees_count: '',
      restaurant_following: false,
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
    axios.get(`${ApiServer.USERS}/${this.props.navigation.state.params.user.id}?category=restaurant`, config)
      .then((response) => {
        this.setState({
          loading: false,
          user: response.data.user,
          restaurant_followers_count: response.data.restaurant_followers_count,
          restaurant_followees_count: response.data.restaurant_followees_count,
          restaurant_following: response.data.restaurant_following,
        });
      })
      .catch((error) => {
        console.log(error.response);
      });
  }

  followCall(category, data, onSuccess) {
    const header = {
      headers: {
        'X-User-Email': ApplicationStore.email,
        'X-User-Token': ApplicationStore.token
      }
    };

    axios.post(`${ApiServer.FOLLOWINGS}/?category=${category}`, data, header)
      .then((response) => {
        onSuccess(response); // 업로드 후 유저를 통째로 리턴시킨다.
      }).catch((error) => {
      console.log(error.response);
      Toast.show({
        text: JSON.stringify(error.response.data),
        position: 'bottom',
        duration: 1500,
      });
    });
  }

  toggleRestaurantFollow() {
    const data = {
      following: {
        user_id: this.state.user.id,
        restaurant_following: !this.state.restaurant_following,
      }
    };
    this.followCall('restaurant' ,data, (response) => this.onFollowRestaurantSuccess(response));
  }

  onFollowRestaurantSuccess(response) {
    this.setState({
      restaurant_following: !this.state.restaurant_following,
      restaurant_followers_count: this.state.restaurant_following ? this.state.restaurant_followers_count -= 1 : this.state.restaurant_followers_count += 1
    });
  }

  renderRestaurantPopUp(item) {
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
        ref={(popupDialog) => {
          this.popupDialog = popupDialog;
        }}
      >
        <UserFiveRestaurantModal
          marginTop={80}
          marginLeft={20}
          marginRight={20}
          marginBottom={120}
          navigation={navigation}
          closePopUp={() => this.popupDialog.dismiss()}
        />
      </PopupDialog>
    );
  }

  renderRestaurantFollowing() {
    if (this.state.restaurant_following) {
      return (
        <FollowUserButton
          onPress={() => this.toggleRestaurantFollow()}
          title={' 팔로잉'}
          clicked
        />
      );
    } else {
      return (
        <FollowUserButton
          onPress={() => this.toggleRestaurantFollow()}
          title={'+팔로우 '}
        />
      );
    }
  }

  render() {
    const { preLoading } = BaseStyle;
    const { navigation } = this.props;

    return (
      <Container style={{ backgroundColor: '#FFFFFF' }}>
        <Grid style={{ padding: 10 }}>
          <Row style={{
            flex: 1,
            alignItems: 'center',
          }}>
            <Col style={{ alignItems: 'center' }}>
              <UserUnitRound
                id={this.state.user.id}
                name={this.state.user.name}
                image_url={this.state.user.image_url}
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
            height: 100,
            alignItems: 'center',
          }}>
            <Col style={{ justifyContent: 'center', alignItems: 'center' }}>
              <FollowerButton
                onPress={() => this.popupDialog.show()}
                title={'맛집'}
                followees={this.state.restaurant_followees_count}
                followers={this.state.restaurant_followers_count}
              />
            </Col>
            <Col style={{ justifyContent: 'center', alignItems: 'center' }}>
              <FollowerButton
                title={'음악'}
                followees={'24'}
                followers={'299'}
              />
            </Col>
            <Col style={{ justifyContent: 'center', alignItems: 'center' }}>
              <FollowerButton
                title={'책'}
                followees={'27'}
                followers={'310'}
              />
            </Col>
          </Row>
          <Row style={{
            height: 50,
            alignItems: 'center'
          }}>
            <Col style={{ justifyContent: 'center', alignItems: 'center' }}>
              <View>
                {this.renderRestaurantFollowing()}
              </View>
            </Col>
            <Col style={{ justifyContent: 'center', alignItems: 'center' }}>
              <View>
                <FollowUserButton
                  onPress={() => console.log('hi')}
                  title={'+팔로우 '}
                />
              </View>
            </Col>
            <Col style={{ justifyContent: 'center', alignItems: 'center' }}>
              <View>
                <FollowUserButton
                  onPress={() => console.log('hi')}
                  title={'+팔로우 '}
                />
              </View>
            </Col>
          </Row>
        </Grid>
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
