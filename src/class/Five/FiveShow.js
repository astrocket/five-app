import React, { Component } from 'react';
import {
  View, Alert, FlatList, RefreshControl, Linking, StatusBar,
} from 'react-native';
import {
  Container, Content, Text, Spinner, Thumbnail, Button, Icon, Left,
  Body, Toast, ListItem, ActionSheet, List,
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import {
  RowHeaderBar, NavBar, UserUnitRound, AddSmallButton, ListItemIconClick,
} from '../../component/common';
import { FiveUnitRound, ImageCon } from '../../component/common';
import axios from 'axios';
import { NavigationActions } from 'react-navigation';
import * as Images from '../../assets/images/Images';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('ApplicationStore') // Inject some or all the stores!
@observer
export default class FiveShow extends Component {

  static navigationOptions = ({ navigation }) => ({
    header: null,
    statusBarStyle: 'dark-content',
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: true, //실서비스에서는 로딩 true로
      refreshing: false,
      category: this.props.navigation.state.params.category,
      category_korean: Constant.CategoryToKorean(this.props.navigation.state.params.category),
      header: {
        headers: {
          'X-User-Email': this.props.ApplicationStore.email,
          'X-User-Token': this.props.ApplicationStore.token,
        },
      },
      five: '',
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
    this.apiCall();
  }

  // API CALLS

  async apiCall() {
    console.log(this.props.navigation.state.params.id);
    await axios.get(`${Constant.CategoryToApi(this.state.category)}/${this.props.navigation.state.params.id}`, this.state.header)
      .then((response) => {
        this.setState({
          loading: false,
          five: response.data.five,
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
    var url = `${ApiServer.MY_PROFILE}/create_wish?category=${this.state.category}`;

    const data = {
      favorable_id: this.state.five.id,
    };

    if (this.state.my_wish) {
      this.deleteWishCall()
    } else {
      axios.post(url, data, this.state.header)
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
    var url = `${ApiServer.MY_PROFILE}/create_five?category=${this.state.category}`;

    const data = {
      favorable_id: this.state.five.id,
    };

    if (this.state.my_five) {
      this.deleteFiveCall()
    } else {
      axios.post(url, data, this.state.header)
        .then((response) => {
          this.onCreateFiveCallSuccess(response.data);
        }).catch((error) => {
        console.log(error.response.data);
        if (error.response.data.full) {
          this.askAddWish(JSON.stringify(error.response.data.errors[0]));
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

  deleteWishCall() {
    const data = {
      favorable_id: this.state.five.id,
    };
    axios.post(`${ApiServer.MY_PROFILE}/destroy_wish?category=${this.state.category}`, data, this.state.header)
      .then((response) => {
        this.setState({
          my_wish: false
        });
      }).catch((error) => {
      console.log(error.response);
      Toast.show({
        text: '에러 : ' + JSON.stringify(error.response.data.errors),
        position: 'bottom',
        duration: 1500,
      });
    });
  }

  deleteFiveCall() {
    const data = {
      favorable_id: this.state.five.id,
    };
    axios.post(`${ApiServer.MY_PROFILE}/destroy_five?category=${this.state.category}`, data, this.state.header)
      .then((response) => {
        this.setState({
          five_users_count: (this.state.five_users_count -= 1),
          my_five: false
        });
      }).catch((error) => {
      console.log(error.response);
      Toast.show({
        text: '에러 : ' + JSON.stringify(error.response.data.errors),
        position: 'bottom',
        duration: 1500,
      });
    });
  }

  askAddWish(msg) {
    Alert.alert(
      `${msg}`,
      `${this.state.five.title}을(를) ${this.state.category_korean} 보관함에 담으시겠어요?`,
      [
        {
          text: '아니요',
          style: 'cancel',
        },
        {
          text: '네',
          onPress: () => this.createWishCall()
        },
      ],
      { cancelable: true },
    );
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

  handleOnCreateFiveCallFull() {
    Alert.alert(
      `FIVE 추가 불가능`,
      `이미 5개의 FIVE가 선택되어서 추가로 담을 수 없습니다.`,
      [
        {
          text: 'FIVE 바꾸기',
          onPress: () => this.props.navigation.navigate('ProfileFiveEdit', {
            category: this.state.category,
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
    const my_five = data.my_five;
    const my_wish = data.my_wish;

    this.setState({
      five_users_count: (this.state.five_users_count += 1),
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
          <NavBar
            statusBar={'light-content'}
            backgroundImage={{url: this.state.five.image_large_url}}
            leftButton
            leftAsImage
            leftIcon={require('../../assets/images/arrow_icon_white.png')}
            onPressLeft={() => navigation.goBack()}
          />
          <Grid>
            <Row style={{
              padding: 10,
              marginBottom: 10,
            }}>
              <View style={{
                flex: 1,
                flexDirection: 'column',
              }}>
                <View>
                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <Text large numberOfLines={1} style={{ marginLeft: 2, width: Constant.deviceWidth/3*2}}>{this.state.five.title}</Text>
                    <View style={BaseStyle.headerDoubleIconsContainer}>
                      <Button onPress={() => this.createWishCall()} transparent style={{ marginRight: 16 }}>
                        {this.state.my_wish ?
                          <ImageCon
                            image={require('../../assets/images/bookmark_pink_full.png')}
                          /> : <ImageCon
                            image={require('../../assets/images/bookmark_icon_pink.png')}
                          />}
                      </Button>
                      <View style={{
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                        paddingRight: 5,
                      }}>
                        <AddSmallButton
                          onPress={() => this.createFiveCall()}
                          textTrue={'담김'}
                          textFalse={'+ 담기'}
                          clicked={this.state.my_five}
                        />
                      </View>
                    </View>
                  </View>
                  <Text note numberOfLines={1} style={{ marginLeft: 3 }}>{this.state.five.subtitle}</Text>
                </View>
              </View>
            </Row>
            <List style={{ paddingBottom: 20 }}>
              <ListItem avatar style={{ borderTopWidth: 0.5, borderTopColor: 'rgba(237, 237, 237, 0.5)', borderBottomWidth: 0.5, borderBottomColor: 'rgba(237, 237, 237, 0.5)', padding: 5, marginBottom: 10}}>
                <Left>
                  <Thumbnail small source={Images.findImageOf(this.state.category)}/>
                </Left>
                <Body style={{ borderBottomWidth: 0 }}>
                <Text>{this.state.category_korean}</Text>
                </Body>
              </ListItem>
              {/* 지도 */}
              <ListItemIconClick
                icon={'md-map'}
                onPress={() => this.props.screenProps.modalNavigation.navigate('Map', {
                  lat: this.state.five.lat,
                  lng: this.state.five.lng,
                  title: this.state.five.title,
                })}
                target={this.state.five.address}
                title={this.state.five.address}
              />
              {/* 전화 */}
              <ListItemIconClick
                icon={'md-call'}
                onPress={() => Linking.openURL(`tel:${this.state.five.phone}`)}
                target={this.state.five.phone}
                title={this.state.five.phone}
              />
              {/* 링크 */}
              <ListItemIconClick
                label={'가사'}
                onPress={() => this.props.screenProps.modalNavigation.navigate('ModalWebViewShow', {
                  url: this.state.five.related_link,
                  headerTitle: '가사 보기'
                })}
                target={this.state.five.related_link}
                title={'가사 보기'}
              />
              {/* 유튜브 링크 */}
              <ListItemIconClick
                label={'YouTube'}
                onPress={() => this.props.screenProps.modalNavigation.navigate('ModalWebViewShow', {
                  url: this.state.five.youtube_link,
                  headerTitle: this.state.five.track_name
                })}
                target={this.state.five.youtube_link}
                title={'음악 듣기'}
              />
            </List>
            <RowHeaderBar
              style={{ backgroundColor: '#fafafa' }}
              title={`이 ${this.state.category_korean}을 FIVE한 사람들   `}
              yellowLabel={`${Number(this.state.five_users_count).toLocaleString()}`}
              onPress={() => navigation.navigate('FiveUserList', {
                users: this.state.users, title: `FIVE한 사람들`,
                category: this.state.category,
                favorable_id: this.state.five.id,
              })}
              moreTitle={'더보기'}
            />
            <Row style={{ backgroundColor: '#fafafa' }}>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
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
              title={navigation.state.params.suggest_title || `이 ${this.state.category_korean} 관련 북마크 제안`}
            />
            <Row>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={this.state.related_fives}
                style={rowWrapper}
                renderItem={({ item }) => (
                  <FiveUnitRound
                    id={item.id}
                    title={item.title}
                    subtitle={item.subtitle}
                    five_users_count={item.five_users_count}
                    image_url={item.image_medium_url}
                    onPress={() => navigation.navigate('FiveShow', {
                      category: item.category,
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
