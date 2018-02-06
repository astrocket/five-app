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
  RowHeaderBar, FollowSmallButton, FiveUserUnitBar, FiveUnitFull,
} from '../../component/common';
import { FiveUnitRound } from '../../component/common';
import axios from 'axios';
import { NavigationActions } from 'react-navigation';
import * as Images from '../../assets/images/Images';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('ApplicationStore') // Inject some or all the stores!
@observer
export default class RestaurantShow extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.title,

    headerRight: (
      navigation.state.params.navLoading ?
        null :
        <View style={BaseStyle.headerDoubleIconsContainer}>
          <Button onPress={navigation.state.params.openShareActionSheet} transparent>
            <Icon
              name="ios-share-outline"
              style={{
                fontSize: 25,
                color: Constant.FiveColor,
              }}
            />
          </Button>
          <View style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingRight: 5,
          }}>
            <FollowSmallButton
              onPress={navigation.state.params.openFiveActionSheet}
              textTrue={'담김'}
              textFalse={'+ 담기'}
              clicked={navigation.state.params.my_five && navigation.state.params.my_wish}
            />
          </View>
        </View>
    ),
    ...Constant.FiveNavOptions,
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: true, //실서비스에서는 로딩 true로
      restaurant: '',
      flip: false,
      five_users: [],
      five_users_count: '',
      my_five: false,
      my_wish: false,
      clicked: true,
      related_fives: [],
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({
      openShareActionSheet: () => this.openShareActionSheet(),
      openFiveActionSheet: () => this.openFiveActionSheet(),
    });
    this.apiCall();
  }

  // API CALLS

  apiCall() {
    const config = {
      headers: {
        'X-User-Email': this.props.ApplicationStore.email,
        'X-User-Token': this.props.ApplicationStore.token,
      },
    };
    console.log(this.props.navigation.state.params.id);
    axios.get(`${ApiServer.RESTAURANTS}/${this.props.navigation.state.params.id}`, config)
      .then((response) => {
        this.props.navigation.setParams({
          my_five: response.data.my_five,
          my_wish: response.data.my_wish,
          navLoading: false,
        });
        this.setState({
          loading: false,
          restaurant: response.data.restaurant,
          five_users: response.data.five_users,
          five_users_count: response.data.five_users_count,
          my_five: response.data.my_five,
          my_wish: response.data.my_wish,
          related_fives: response.data.related_fives,
        });
      })
      .catch((error) => {
        console.log('에러 : ' + JSON.stringify(error.response));
      });
  }

  createFiveCall(url) {
    const data = {
      favorable_id: this.state.restaurant.id,
    };

    const header = {
      headers: {
        'X-User-Email': this.props.ApplicationStore.email,
        'X-User-Token': this.props.ApplicationStore.token,
      },
    };

    if (url) {
      axios.post(url, data, header)
        .then((response) => {
          this.onCreateFiveCallSuccess(response.data);
        }).catch((error) => {
        console.log(error.response.data);
        if (error.response.data.full) {
          this.handleOnCreateFiveCallFull()
        } else {
          Toast.show({
            text: '에러 : ' + JSON.stringify(error.response.data.errors),
            position: 'bottom',
            duration: 1500,
          });
        }
      });
    }
  }

  // CONTROLLERS

  openShareActionSheet() {
    const BUTTONS = [ '카카오톡 공유하기', 'Cancel' ];
    const CANCEL_INDEX = 1;

    ActionSheet.show(
      {
        options: BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
      },
      buttonIndex => this.shareAction(BUTTONS[ buttonIndex ]),
    );
  }

  openFiveActionSheet() {
    const my_five = this.state.my_five;
    const my_wish = this.state.my_wish;
    var BUTTONS;
    var URLS;
    var CANCEL_INDEX ;
    var message;

    if (!my_five && !my_wish) {
      BUTTONS = [ '보관함으로 추가', '나만의 FIVE 추가', 'Cancel' ];
      URLS = [`${ApiServer.MY_PROFILE}/create_wish?category=restaurant`, `${ApiServer.MY_PROFILE}/create_five?category=restaurant`, false];
      CANCEL_INDEX = 2;
      message = '보관함 또는 나만의 FIVE에 담아보세요.'
    } else if (!my_five && my_wish) {
      BUTTONS = [ '나만의 FIVE 추가', 'Cancel' ];
      URLS = [`${ApiServer.MY_PROFILE}/create_five?category=restaurant`, false];
      CANCEL_INDEX = 1;
      message = '이미 보관함에 있는 아이템 입니다.'
    } else if (my_five && !my_wish) {
      BUTTONS = [ '보관함으로 추가', 'Cancel' ];
      URLS = [`${ApiServer.MY_PROFILE}/create_wish?category=restaurant`, false];
      CANCEL_INDEX = 1;
      message = '이미 FIVE에 있는 아이템 입니다.'
    } else {
      BUTTONS = [ 'Cancel' ];
      URLS = [false];
      CANCEL_INDEX = 0;
      message = '이미 FIVE이면서 보관함에 담긴 아이템 입니다.'
    }

    ActionSheet.show(
      {
        options: BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
        title: message
      },
      buttonIndex => this.createFiveCall(URLS[buttonIndex]),
    );
  }

  shareAction(value) {
    Toast.show({
      text: value,
      position: 'bottom',
      duration: 1500,
    });
  }

  handleOnCreateFiveCallFull() {
    Alert.alert(
      `FIVE추가 불가능`,
      `이미 5개의 FIVE가 선택되어서 추가로 담을 수 없습니다.`,
      [
        {
          text: 'FIVE 바꾸기',
          onPress: () => this.props.navigation.navigate("ProfileFiveEdit", {
            five_category: 'restaurant'
          }),
        },
        {
          text: '확인',
          style: 'cancel',
        }
      ],
      { cancelable: true },
    );
  }

  onCreateFiveCallSuccess(data) {
    const before_my_five = this.state.my_five;
    const my_five = data.my_five;
    const my_wish = data.my_wish;
    const fives_count = data.fives_count;

    this.setState({
      my_five: my_five,
      my_wish: my_wish,
    });

    if (before_my_five !== my_five) {
      this.setState({
        five_users_count: my_five ? this.state.five_users_count += 1 : this.state.five_users_count -= 1,
      }, () => {
        var message;
        if ( fives_count === 5 ) {
          message = `${this.state.restaurant.title}이(가) 맛집 FIVE로 선택되었습니다. 이제 FIVE 5개를 다 담았어요!`;
        } else {
          message = `${this.state.restaurant.title}이(가) 맛집 FIVE로 선택되었습니다. 아직 ${5 - fives_count}개를 더 선택할 수 있어요!`;
        }
        Alert.alert(
          '맛집 FIVE 선택됨',
          message,
          [
            {
              text: '확인',
              style: 'cancel',
            }
          ],
          { cancelable: true },
        );
      });
    }

    this.props.navigation.setParams({
      my_five: my_five,
      my_wish: my_wish,
    });
  }

  // VIEW

  render() {
    const { container, preLoading, rowWrapper } = BaseStyle;
    const { navigation } = this.props;

    return (
      <Container>
        <Content>
          <Grid>
            <Row>
              <FiveUnitFull
                id={this.state.restaurant.id}
                location={this.state.restaurant.location}
                title={this.state.restaurant.title}
                image_url={this.state.restaurant.image_large_url}
                onPress={() => navigation.navigate('Map', {
                  lat: '33',
                  lng: '22',
                  title: this.state.restaurant.title,
                })}
                barWidth={null}
                barHeight={null}
                borderRadius={15}
                marginRight={0}
              />
            </Row>
            <ListItem avatar>
              <Left>
                <Thumbnail small source={Images.book_main}/>
              </Left>
              <Body style={{ borderBottomWidth: 0 }}>
              <Text>레스토랑</Text>
              </Body>
            </ListItem>
            <RowHeaderBar
              style={{ backgroundColor: '#fafafa' }}
              title={`${Number(this.state.five_users_count).toLocaleString()}명의 FIVE`}
              onPress={() => navigation.navigate('RestaurantFiveUserList', {
                users: this.state.users,
                category: 'restaurant',
                favorable_id: this.state.restaurant.id,
              })}
              moreTitle={'더보기'}
            />
            <Row style={{ backgroundColor: '#fafafa' }}>
              <FlatList
                data={this.state.five_users}
                renderItem={({ item }) => (
                  <FiveUserUnitBar
                    style={{ backgroundColor: '#fafafa' }}
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
            <RowHeaderBar
              title={'관련 아이템'}
            />
            <Row>
              <FlatList
                horizontal
                data={this.state.related_fives}
                style={rowWrapper}
                renderItem={({ item }) => (
                  <FiveUnitRound
                    id={item.id}
                    title={item.title}
                    subtitle={item.subtitle}
                    five_users_count={item.five_users_count}
                    image_url={item.image_medium_url}
                    onPress={() => navigation.navigate(`${item.klass}Show`, { title: item.title, id: item.id, navLoading: true })}
                    barWidth={150}
                    barHeight={150}
                    borderRadius={15}
                    marginRight={10}
                  />
                )}
                keyExtractor={item => `related-${item.klass}-fives-` + item.id}
              />
            </Row>
          </Grid>
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
