import React, { Component } from 'react';
import {
  View, Alert, FlatList, RefreshControl, Linking,
} from 'react-native';
import {
  Container, Header, Content, Text, Spinner,
  Card, CardItem, Thumbnail, Button, Icon, Left,
  Body, Right, H1, Toast, ListItem, ActionSheet, List,
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import {
  RowHeaderBar, FollowSmallButton, UserUnitRound, FiveUnitFull, ListItemIconClick,
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
export default class MusicShow extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: null,//navigation.state.params.title,

    headerRight: (
      navigation.state.params.navLoading ?
        null :
        <View style={BaseStyle.headerDoubleIconsContainer}>
          <Button onPress={navigation.state.params.createWishCall} transparent>
            <Icon
              name="md-attach"
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
              onPress={navigation.state.params.createFiveCall}
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
      refreshing: false,
      music: '',
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
      createWishCall: () => this.createWishCall(),
      createFiveCall: () => this.createFiveCall(),
    });
    this.apiCall();
  }

  // API CALLS

  async apiCall() {
    const config = {
      headers: {
        'X-User-Email': this.props.ApplicationStore.email,
        'X-User-Token': this.props.ApplicationStore.token,
      },
    };
    console.log(this.props.navigation.state.params.id);
    await axios.get(`${ApiServer.MUSICS}/${this.props.navigation.state.params.id}`, config)
      .then((response) => {
        this.props.navigation.setParams({
          my_five: response.data.my_five,
          my_wish: response.data.my_wish,
          navLoading: false,
        });
        this.setState({
          loading: false,
          music: response.data.music,
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

  _onRefresh() {
    this.setState({ refreshing: true });
    this.apiCall().then(() => {
      this.setState({ refreshing: false });
    });
  }

  createWishCall() {
    var url = `${ApiServer.MY_PROFILE}/create_wish?category=music`;

    const data = {
      favorable_id: this.state.music.id,
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
          this.handleOnCreateFiveCallFull();
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

  createFiveCall() {
    var url = `${ApiServer.MY_PROFILE}/create_five?category=music`;

    const data = {
      favorable_id: this.state.music.id,
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
          this.handleOnCreateFiveCallFull();
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
    var CANCEL_INDEX;
    var message;

    if (!my_five && !my_wish) {
      BUTTONS = [ '보관함으로 추가', '나만의 FIVE 추가', 'Cancel' ];
      URLS = [ `${ApiServer.MY_PROFILE}/create_wish?category=music`, `${ApiServer.MY_PROFILE}/create_five?category=music`, false ];
      CANCEL_INDEX = 2;
      message = '보관함 또는 나만의 FIVE에 담아보세요.';
    } else if (!my_five && my_wish) {
      BUTTONS = [ '나만의 FIVE 추가', 'Cancel' ];
      URLS = [ `${ApiServer.MY_PROFILE}/create_five?category=music`, false ];
      CANCEL_INDEX = 1;
      message = '이미 보관함에 있는 아이템 입니다.';
    } else if (my_five && !my_wish) {
      BUTTONS = [ '보관함으로 추가', 'Cancel' ];
      URLS = [ `${ApiServer.MY_PROFILE}/create_wish?category=music`, false ];
      CANCEL_INDEX = 1;
      message = '이미 FIVE에 있는 아이템 입니다.';
    } else {
      BUTTONS = [ 'Cancel' ];
      URLS = [ false ];
      CANCEL_INDEX = 0;
      message = '이미 FIVE이면서 보관함에 담긴 아이템 입니다.';
    }

    ActionSheet.show(
      {
        options: BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
        title: message,
      },
      buttonIndex => this.createFiveCall(URLS[ buttonIndex ]),
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
          onPress: () => this.props.navigation.navigate('ProfileFiveEdit', {
            five_category: 'music',
          }),
        },
        {
          text: '확인',
          style: 'cancel',
        },
      ],
      { cancelable: true },
    );
  }

  onCreateFiveCallSuccess(data) {
    const before_my_five = this.state.my_five;
    const before_my_wish = this.state.my_wish;
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
        if (fives_count === 5) {
          message = `${this.state.music.title}이(가) 음악 FIVE로 선택되었습니다. 이제 FIVE 5개를 다 담았어요!`;
        } else {
          message = `${this.state.music.title}이(가) 음악 FIVE로 선택되었습니다. 아직 ${5 - fives_count}개를 더 선택할 수 있어요!`;
        }
        Alert.alert(
          '음악 FIVE 선택됨',
          message,
          [
            {
              text: '확인',
              style: 'cancel',
            },
          ],
          { cancelable: true },
        );
      });
    } else if (before_my_wish !== my_wish) {
      Alert.alert(
        '성공',
        `${this.state.music.title}이(가) 음악 클립에 추가되었습니다.`,
        [
          {
            text: '확인',
            style: 'cancel',
          },
        ],
        { cancelable: true },
      );
    } else if (before_my_wish === my_wish) {
      Toast.show({
        text: '이미 클립에 담긴 음악 입니다.',
        position: 'bottom',
        duration: 1500,
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
        <Content refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }>
          <Grid>
            <Row style={{
              paddingLeft: 10,
              paddingRight: 10,
            }}>
              <FiveUnitFull
                id={this.state.music.id}
                subtitle={this.state.music.subtitle}
                title={this.state.music.title}
                image_url={this.state.music.image_large_url}
                barWidth={null}
                barHeight={null}
                borderRadius={15}
                marginRight={0}
              />
            </Row>
            <List style={{ paddingBottom: 20 }}>
              <ListItem avatar>
                <Left>
                  <Thumbnail small source={Images.music_main}/>
                </Left>
                <Body style={{ borderBottomWidth: 0 }}>
                <Text>음악</Text>
                </Body>
              </ListItem>
              <ListItemIconClick
                icon={'md-map'}
                onPress={() => this.props.screenProps.modalNavigation.navigate('Map', {
                  lat: this.state.music.lat,
                  lng: this.state.music.lng,
                  title: this.state.music.title,
                })}
                target={this.state.music.address}
                title={this.state.music.address}
              />
              <ListItemIconClick
                icon={'md-call'}
                onPress={() => Linking.openURL(`tel:${this.state.music.phone}`)}
                target={this.state.music.phone}
                title={this.state.music.phone}
              />
              <ListItemIconClick
                icon={'md-globe'}
                onPress={() => this.props.screenProps.modalNavigation.navigate('ModalWebViewShow', {
                  url: this.state.music.related_link,
                  headerTitle: this.state.music.related_link
                })}
                target={this.state.music.related_link}
                title={this.state.music.related_link}
              />
            </List>
            <RowHeaderBar
              style={{ backgroundColor: '#fafafa' }}
              title={`${Number(this.state.five_users_count).toLocaleString()}명의 FIVE`}
              onPress={() => navigation.navigate('MusicFiveUserList', {
                users: this.state.users,
                category: 'music',
                favorable_id: this.state.music.id,
              })}
              moreTitle={'더보기'}
            />
            <Row style={{ backgroundColor: '#fafafa' }}>
              <FlatList
                horizontal
                data={this.state.five_users}
                style={rowWrapper}
                renderItem={({ item }) => (
                  <UserUnitRound
                    id={item.id}
                    name={item.name}
                    image_url={item.image_medium_url}
                    onPress={() => navigation.navigate('UserShow', {
                      user: item,
                      title: item.name,
                    })}
                    barWidth={90}
                    barHeight={90}
                    borderRadius={45}
                    marginRight={10}
                  />
                )}
                keyExtractor={item => 'follower-list-' + item.id}
              />
            </Row>
            <RowHeaderBar
              title={'근처의 또다른 FIVE 음악'}
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
                    onPress={() => navigation.navigate(`${item.klass}Show`, {
                      title: item.title,
                      id: item.id,
                      navLoading: true,
                    })}
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
