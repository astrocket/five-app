import React, {Component} from 'react';
import {
  Image, TouchableOpacity, View,
} from 'react-native';
import {
  Card, CardItem, Text, Thumbnail, ListItem, Left, Body, Right, Button, Icon
} from 'native-base';
import {
  FollowSmallButton
} from './FollowSmallButton';
import axios from 'axios';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import ApplicationStore from '../../mobx/ApplicationStore';

export default class FollowUnitBar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false, //실서비스에서는 로딩 true 로
      foodFollowing: this.props.food_following
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
    axios.get(ApiServer.HOME_INDEX, config)
      .then((response) => {
        console.log(response);
        this.setState({
          loading: false,
        });
      })
      .catch((error) => {
        console.log(error.response);
      });
  }

  toggleFoodFollow() {
    this.setState({
      foodFollowing: !this.state.foodFollowing,
    }); // 단순 토글이 아닌, api로 팔우 상태 변경후 리턴값으로 state 변경시켜주어야 한다.
  }

  render() {
    return (
      <ListItem avatar>
        <Left>
          <Thumbnail source={{ uri: this.props.image_url }}/>
        </Left>
        <Body>
        <Text numberOfLines={1}>{this.props.name}</Text>
        <Text note>Doing what you like will always keep you happy . .</Text>
        </Body>
        <Right style={{ width: 120, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <FollowSmallButton
            icon={'logo-apple'}
            onPress={() => this.toggleFoodFollow()} //api 요청
            clicked={this.state.foodFollowing}
          />
          <FollowSmallButton
            icon={'logo-apple'}
            clicked={false}
          />
          <FollowSmallButton
            icon={'logo-apple'}
            clicked={false}
          />
        </Right>
      </ListItem>
    );
  }
};
