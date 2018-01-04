import React, { Component } from 'react';
import {
  View, Image, Alert, FlatList,
} from 'react-native';
import {
  Container, Header, Content, Text, Spinner,
  Card, CardItem, Thumbnail, Button, Icon, Left,
  Body, Right, H1, Toast, ListItem, ActionSheet,
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import {
  SmallButton, FiveUserUnitBar, RestaurantUnitFull,
} from '../../component/common';
import { FollowUnitBar } from '../../component/common';
import axios from 'axios';
import { NavigationActions } from 'react-navigation';
import * as Images from '../../assets/images/Images';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import ApplicationStore from '../../mobx/ApplicationStore';

export default class RestaurantShow extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.title,

    headerRight: (
      <View style={BaseStyle.headerDoubleIconsContainer}>
        <Button onPress={() => navigation.navigate('Setting')} transparent>
          <Icon
            name="ios-share-outline"
            style={{
              fontSize: 25,
              color: Constant.FiveColor,
            }}
          />
        </Button>
        <Button onPress={navigation.state.params.shareActionSheet} transparent>
          <Icon
            name="ios-add-circle"
            style={{
              fontSize: 25,
              color: Constant.FiveColor,
            }}
          />
        </Button>
      </View>
    ),
    ...Constant.FiveNavOptions,
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: true, //실서비스에서는 로딩 true로
      restaurant: [],
      flip: false,
      five_users: [],
      five_users_count: '',
      my_five: false,
      clicked: true,
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({ shareActionSheet: this.openActionSheet });
    this.apiCall();
  }

  apiCall() {
    const config = {
      headers: {
        'X-User-Email': ApplicationStore.email,
        'X-User-Token': ApplicationStore.token,
      },
    };
    console.log(this.props.navigation.state.params.restaurant_id);
    axios.get(`${ApiServer.RESTAURANTS}/${this.props.navigation.state.params.restaurant_id}`, config)
      .then((response) => {
        this.props.navigation.setParams({ my_five: response.data.my_five });
        this.setState({
          loading: false,
          restaurant: response.data.restaurant,
          five_users: response.data.five_users,
          five_users_count: response.data.five_users_count,
        });
      })
      .catch((error) => {
        console.log('에러 : ' + error.response);
      });
  }

  createFiveCall() {
    const data = {
      restaurant: {
        favorable_id: this.state.restaurant.id,
      },
    };

    const header = {
      headers: {
        'X-User-Email': ApplicationStore.email,
        'X-User-Token': ApplicationStore.token,
      },
    };

    axios.post(`${ApiServer.MY_PROFILE}/create_five?category=restaurant`, data, header)
      .then((response) => {
        this.onCreateFiveCallSuccess();
      }).catch((error) => {
      Toast.show({
        text: JSON.stringify('에러 : ' + error.response),
        position: 'bottom',
        duration: 1500,
      });
    });
  }

  onCreateFiveCallSuccess() {
    const resetAction = NavigationActions.reset({
      index: 1,
      actions: [
        NavigationActions.navigate({
          routeName: 'Main',
        }),
        NavigationActions.navigate({
          routeName: 'MyItemIndex',
        }),
      ],
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
      flip: !this.state.flip,
    });
  }

  renderCardFlipper() {
    return (
      <ListItem>
        <Button transparent onPress={() => this.flipCard()}>
          <Text>{`${Number(this.state.five_users_count).toLocaleString()}명의 FIVE`}</Text>
        </Button>
      </ListItem>
    );
  }

  renderCard(flip) {
    const { navigation } = this.props;

    if (flip) {
      return (
        <Row>
          <FlatList
            data={this.state.five_users}
            renderItem={({ item }) => (
              <FiveUserUnitBar
                user={item}
                onPress={() => navigation.navigate('UserShow', {
                  user: item,
                  title: item.name,
                })}
              />
            )}
            keyExtractor={item => 'follower-list-' + item.id}
          />
        </Row>
      );
    } else {
      return (
        <Row>
          <RestaurantUnitFull
            id={this.state.restaurant.id}
            location={this.state.restaurant.location}
            title={this.state.restaurant.title}
            image_url={this.state.restaurant.image_url}
            onPress={() => navigation.navigate('Map', {
              lat: '33',
              lng: '22',
              title: this.state.restaurant.title,
            })}
            barWidth={null}
            barHeight={null}
            borderRadius={15}
            marginRight={10}
          />
        </Row>
      );
    }
  }

  openActionSheet() {
    const BUTTONS = [ '보관함으로 가기', '나만의 FIVE 추가', 'Cancel' ];
    const CANCEL_INDEX = 2;

    ActionSheet.show(
      {
        options: BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
      },
      buttonIndex => this.createFiveCall(),
    );
  }

  render() {
    const { container, preLoading } = BaseStyle;
    const { navigation } = this.props;

    return (
      <Container>
        <Content>
          {this.renderCard(this.state.flip)}
          <ListItem avatar>
            <Left>
              <Thumbnail small source={Images.book_main}/>
            </Left>
            <Body style={{ borderBottomWidth: 0 }}>
            <Text>레스토랑</Text>
            </Body>
          </ListItem>
          {this.renderCardFlipper()}
        </Content>
      </Container>
    );
  }

  render2() {
    const { container, preLoading } = BaseStyle;
    const { navigation } = this.props;

    if (this.state.flip) {
      return (
        <Container>
          <Content>
            {this.renderCardFlipper()}
            <Grid style={{
              padding: 10,
              marginTop: this.props.marginTop,
              marginLeft: this.props.marginLeft,
              marginRight: this.props.marginRight,
              marginBottom: this.props.marginBottom,
              borderRadius: 10,
              backgroundColor: '#FFF',
            }}>
              <FlatList
                data={this.state.five_users}
                renderItem={({ item }) => (
                  <FiveUserUnitBar
                    user={item}
                    onPress={() => navigation.navigate('UserShow', {
                      user: item,
                      title: item.name,
                    })}
                  />
                )}
                keyExtractor={item => 'follow-list-' + item.id}
              />
            </Grid>
          </Content>
        </Container>
      );
    } else {
      return (
        <Container>
          <Content>
            <Grid style={{
              padding: 10,
              marginTop: this.props.marginTop,
              marginLeft: this.props.marginLeft,
              marginRight: this.props.marginRight,
              marginBottom: this.props.marginBottom,
              borderRadius: 10,
              backgroundColor: '#FFF',
            }}>
              <Row style={{
                height: 200,
                width: null,
              }}>
                <Image source={{ uri: this.state.restaurant.image_url }} style={{
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
                  {`${this.state.restaurant.location} ${this.state.restaurant.title}`}
                </H1>
                <Button
                  onPress={() => navigation.navigate('Map', {
                    lat: '33',
                    lng: '22',
                    title: this.state.restaurant.title,
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
                {this.renderCardFlipper()}
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
                  onPress={() => this.postUserItem(this.state.restaurant)}
                  title={'담아두기'}
                  clicked={this.state.clicked}
                />
              </Row>
            </Grid>
          </Content>
        </Container>
      );
    }
  }
}
