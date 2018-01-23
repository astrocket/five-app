import React, { Component } from 'react';
import {
  Alert, TouchableOpacity, View,
} from 'react-native';
import {
  Container, Header, Content, Text, Spinner, Card,
  CardItem, Thumbnail, Button, Icon, Left, Body, Right, H1, Toast,
} from 'native-base';
import {
  Col,
  Row,
  Grid,
} from 'react-native-easy-grid';
import {
  RestaurantUnitRound, EmptyBox,
} from '../../component/common';
import axios from 'axios';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('ApplicationStore') // Inject some or all the stores!
@observer
export default class MyFiveRestaurantModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true, //실서비스에서는 로딩 true로
      five_restaurants: [],
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
    axios.get(`${ApiServer.MY_PROFILE}/fives?category=restaurant`, config)
      .then((response) => {
        this.setState({
          loading: false,
          five_restaurants: response.data
        });
      })
      .catch((error) => {
        console.log(error.response);
      });
  }

  deleteCall(url, data, onSuccess) {
    const header = {
      headers: {
        'X-User-Email': this.props.ApplicationStore.email,
        'X-User-Token': this.props.ApplicationStore.token
      }
    };

    axios.post(url, data, header)
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

  askRestaurantDelete(item) {
    const url = `${ApiServer.MY_PROFILE}/destroy_five?category=restaurant`;
    const data = {
      restaurant: {
        favorable_id: item.id
      }
    };

    if (this.state.five_restaurants.length <= 3) {
      Alert.alert(
        '알림',
        '3개 이하로 파이브를 삭제할 수 없습니다.',
        [
          {
            text: '확인',
          },
        ],
        { cancelable: true },
      );
    } else {
      Alert.alert(
        '알림',
        '해당 파이브를 삭제하시겠어요?',
        [
          {
            text: '네',
            onPress: () => this.deleteCall(url, data, (response) => this.onDeleteRestaurantSuccess(response)),
            style: 'cancel',
          },
          { text: '아니요' },
        ],
        { cancelable: true },
      );
    }
  }

  onDeleteRestaurantSuccess(response) {
    this.setState({
      five_restaurants: response.data
    });
  }

  renderFirstThree( askRestaurantDelete) {
    const { navigation } = this.props;
    const five_restaurants = this.state.five_restaurants;

    return [ 0, 1, 2 ].map(function (index, i) {
      const item = five_restaurants[ index ];
      if (item) {
        return (
          <RestaurantUnitRound
            key={i}
            id={item.id}
            location={item.location}
            title={item.title}
            image_url={item.image_url}
            onPress={() => navigation.navigate('RestaurantShow', { title: item.title, id: item.id, navLoading: true })}
            onLongPress={() => askRestaurantDelete(item)}
            barWidth={100}
            barHeight={100}
            borderRadius={35}
            marginRight={0}
          />
        );
      } else {
        return (
          <EmptyBox
            key={i}
            barWidth={100}
            onPress={() => navigation.navigate('RestaurantNew')}
            barHeight={100}
            borderRadius={35}
            marginRight={0}
          />
        );
      }
    });
  }

  renderLastTwo(askRestaurantDelete) {
    const { navigation } = this.props;
    const five_restaurants = this.state.five_restaurants;

    return [ 3, 4 ].map(function (index, i) {
      const item = five_restaurants[ index ];
      if (item) {
        return (
          <RestaurantUnitRound
            key={i}
            id={item.id}
            location={item.location}
            title={item.title}
            image_url={item.image_url}
            onPress={() => navigation.navigate('RestaurantShow', { title: item.title, id: item.id, navLoading: true})}
            onLongPress={() => askRestaurantDelete(item)}
            barWidth={100}
            barHeight={100}
            borderRadius={35}
            marginRight={0}
          />
        );
      } else {
        return (
          <EmptyBox
            key={i}
            barWidth={100}
            onPress={() => navigation.navigate('RestaurantNew')}
            barHeight={100}
            borderRadius={35}
            marginRight={0}
          />
        );
      }
    });
  }

  render() {
    const { container, preLoading } = BaseStyle;
    const { navigation } = this.props;

    return (
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: 'transparent',
        }}
        onPress={() => this.props.closePopUp()}
      >
        <Grid style={{
          padding: 10,
          marginTop: this.propsㅈㅈ.marginTop,
          marginLeft: this.props.marginLeft,
          marginRight: this.props.marginRight,
          marginBottom: this.props.marginBottom,
          borderRadius: 10,
          backgroundColor: '#FFF',
        }}>
          <Row style={{
            height: 140,
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 10,
          }}>
            {this.renderFirstThree((item) => this.askRestaurantDelete(item))}
          </Row>
          <Row style={{
            height: 140,
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}>
            {this.renderLastTwo((item) => this.askRestaurantDelete(item))}
          </Row>
          <Row style={{
            justifyContent: 'center',
          }}>
            <View style={{
              position: 'relative',
              top: -120,
            }}>
              <Button
                style={{
                  width: 70,
                  height: 70,
                  marginBottom: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => console.log('fes')}
                transparent
              >
                <Icon
                  name="ios-share-outline"
                  style={{
                    fontSize: 30,
                    color: '#eee',
                  }}
                />
              </Button>
            </View>
          </Row>
        </Grid>
      </TouchableOpacity>
    );
  }
}
