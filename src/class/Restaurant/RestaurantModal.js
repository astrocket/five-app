import React, { Component } from 'react';
import {
  View,
  Image,
  Alert,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {
  Container,
  Header,
  Content,
  Text,
  Spinner,
  Card,
  CardItem,
  Thumbnail,
  Button,
  Icon,
  Left,
  Body,
  Right,
  H1,
  Toast,
} from 'native-base';
import {
  Col,
  Row,
  Grid,
} from 'react-native-easy-grid';
import {
  SmallButton,
} from '../../component/common';
import FollowUnitBar from '../../component/common/FollowUnitBar';
import axios from 'axios';
import { NavigationActions } from 'react-navigation'
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('ApplicationStore') // Inject some or all the stores!
@observer
export default class RestaurantShow extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false, //실서비스에서는 로딩 true로
      item: '',
      flip: false,
      followers: [
        {
          id: '1',
          name: '혜리',
          image_url: 'https://pbs.twimg.com/profile_images/434151642951213056/h-YeBKj8.jpeg',
          restaurant_following: true
        }, {
          id: '2',
          name: '김유정',
          image_url: 'https://pbs.twimg.com/profile_images/846361396296241152/zK7wpe1o.jpg',
          restaurant_following: false
        }, {
          id: '3',
          name: '설현',
          image_url: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/160911_%EB%8F%99%ED%83%84_%EC%97%94%ED%84%B0%EC%8B%9D%EC%8A%A4_%EC%84%A4%ED%98%84_%ED%8C%AC%EC%8B%B8%EC%9D%B8%ED%9A%8C.jpg',
          restaurant_following: true
        }, {
          id: '4',
          name: 'Taylor Swift',
          image_url: 'https://www.grammy.com/sites/com/files/styles/image_landscape_hero/public/taylorswift-hero-510837066.jpg?itok=VeBknRmv',
          restaurant_following: false
        }, {
          id: '5',
          name: 'Leo',
          image_url: 'https://cdn1.thr.com/sites/default/files/imagecache/landscape_928x523/2014/11/leonardo_dicaprio.jpg',
          restaurant_following: true
        }, {
          id: '6',
          name: '혜리',
          image_url: 'https://pbs.twimg.com/profile_images/434151642951213056/h-YeBKj8.jpeg',
          restaurant_following: true
        }, {
          id: '7',
          name: '김유정',
          image_url: 'https://pbs.twimg.com/profile_images/846361396296241152/zK7wpe1o.jpg',
          restaurant_following: true
        }, {
          id: '8',
          name: '설현',
          image_url: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/160911_%EB%8F%99%ED%83%84_%EC%97%94%ED%84%B0%EC%8B%9D%EC%8A%A4_%EC%84%A4%ED%98%84_%ED%8C%AC%EC%8B%B8%EC%9D%B8%ED%9A%8C.jpg',
          restaurant_following: false
        }, {
          id: '9',
          name: 'Taylor Swift',
          image_url: 'https://www.grammy.com/sites/com/files/styles/image_landscape_hero/public/taylorswift-hero-510837066.jpg?itok=VeBknRmv',
          restaurant_following: true
        }, {
          id: '10',
          name: 'Leo',
          image_url: 'https://cdn1.thr.com/sites/default/files/imagecache/landscape_928x523/2014/11/leonardo_dicaprio.jpg',
          restaurant_following: true
        },
      ]
    };
  }

  apiCall() {
    const config = {
      headers: {
        'X-User-Email': this.props.ApplicationStore.email,
        'X-User-Token': this.props.ApplicationStore.token,
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

  postUserItem(item) {
    const data = {
      restaurant: {
        id: item.id
      }
    };

    const header = {
      headers: {
        'X-User-Email': this.props.ApplicationStore.email,
        'X-User-Token': this.props.ApplicationStore.token
      }
    };

    axios.post(ApiServer.ITEM_ADD, data, header)
      .then((response) => {
        this.onPostUserItemSuccess();
      }).catch((error) => {
      Toast.show({
        text: JSON.stringify('에러 : ' + error.response),
        position: 'bottom',
        duration: 1500,
      });
    });
  }

  onPostUserItemSuccess() {
    const resetAction = NavigationActions.reset({
      index: 1,
      actions: [
        NavigationActions.navigate({
          routeName: 'Main',
        }),
        NavigationActions.navigate({
          routeName: 'MyItemIndex',
        })
      ]
    });

    Alert.alert(
      '알림',
      '담아두기 리스트로 가시겠어요?',
      [
        {
          text: '네',
          onPress: () => this.props.navigation.dispatch(resetAction),
          style: 'cancel',
        },
        { text: '아니요' },
      ],
      { cancelable: true },
    );
  }

  flipCard() {
    this.setState({
      item: this.props.item
    }, () => this.setState({
      flip: !this.state.flip,
    }))
  }

  exitPopUp() {
    this.props.closePopUp();
    this.setState({
      flip: false
    })
  }

  render() {
    const { container, preLoading } = BaseStyle;
    const { navigation } = this.props;

    if (this.state.flip) {
      return (
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: 'transparent'
          }}
          onPress={() => this.exitPopUp()}
        >
          <Grid style={{
            padding: 10,
            marginTop: this.props.marginTop,
            marginLeft: this.props.marginLeft,
            marginRight: this.props.marginRight,
            marginBottom: this.props.marginBottom,
            borderRadius: 10,
            backgroundColor: '#FFF'
          }}>
            <FlatList
              data={this.state.followers}
              renderItem={({ item }) => (
                <FollowUnitBar
                  id={item.id}
                  image_url={item.image_url}
                  name={item.name}
                  onPress={() => navigation.navigate('UserShow', {
                    user: item,
                    title: item.name,
                  })}
                  restaurant_following={item.restaurant_following}
                />
              )}
              keyExtractor={item => 'follow-list-' + item.id}
            />
          </Grid>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: 'transparent'
          }}
          onPress={() => this.exitPopUp()}
        >
          <Grid style={{
            padding: 10,
            marginTop: this.props.marginTop,
            marginLeft: this.props.marginLeft,
            marginRight: this.props.marginRight,
            marginBottom: this.props.marginBottom,
            borderRadius: 10,
            backgroundColor: '#FFF'
          }}>
            <Row style={{
              height: 200,
              width: null,
            }}>
              <Image source={{ uri: this.props.item.image_url }} style={{
                height: null,
                width: null,
                flex: 1,
              }}/>
            </Row>
            <Row style={{
              marginTop: 20,
              marginBottom: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <H1 style={{ textAlign: 'center' }}>
                {`${this.props.item.location} ${this.props.item.title}`}
              </H1>
              <Button
                onPress={() => navigation.navigate('Map', {
                  lat: '33',
                  lng: '22',
                  title: this.props.item.title,
                })}
                transparent
                style={{
                  position: 'absolute',
                  right: 0,
                  top: -5,
                }}
              >
                <Icon
                  name="ios-map-outline"
                  style={{
                    fontSize: 25,
                    color: '#000',
                  }}
                />
              </Button>
            </Row>
            <Row style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Button transparent onPress={() => this.flipCard()}>
                <Text>현재 124명의 Five</Text>
              </Button>
            </Row>
            <Row style={{
              justifyContent: 'center',
              alignItems: 'flex-end',
            }}>
              <SmallButton
                onPress={() => console.log('hi')}
                title={'공유하기'}
              />
              <SmallButton
                onPress={() => this.postUserItem(this.props.item)}
                title={'담아두기'}
                clicked={this.state.clicked}
              />
            </Row>
          </Grid>
        </TouchableOpacity>
      );
    }
  }
}
