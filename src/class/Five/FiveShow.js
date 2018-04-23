import React, { Component } from 'react';
import {
  View, Alert, FlatList, RefreshControl, Linking, StatusBar, Image,
} from 'react-native';
import {
  Container, Content, Text, Spinner, Thumbnail, Button, Left,
  Body, Toast, ListItem, ActionSheet, List, 
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import {
  RowHeaderBar, NavBar, UserUnitRound, AddSmallButton, ListItemIconClick,
} from '../../component/common';
import { FiveUnitRound, FiveShowButtons, ImageCon } from '../../component/common';
import axios from 'axios';
import { NavigationActions } from 'react-navigation';
import * as Images from '../../assets/images/Images';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

import Icon from 'react-native-vector-icons/FontAwesome';

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
        console.log('확인해 주세요! ' + JSON.stringify(error.response));
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
            text: '확인해 주세요! ' + JSON.stringify(error.response.data.errors),
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
            text: '확인해 주세요! ' + JSON.stringify(error.response.data.errors),
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
        text: '확인해 주세요! ' + JSON.stringify(error.response.data.errors),
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
        text: '확인해 주세요! ' + JSON.stringify(error.response.data.errors),
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
      `FIVE 가득참`,
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
            category={this.state.category}
            statusBar={'light-content'}
            backgroundImage={{uri: this.state.five.image_large_url}}
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
                    alignItems: 'center',
                    padding: 0,
                  }}>
                  <Text large numberOfLines={2} style={{ lineHeight: 30, marginLeft: 4, marginRight: 16, width: Constant.deviceWidth/2 + 32}}>{this.state.five.title}</Text>           
                  <Button onPress={() => this.createWishCall()} small transparent style={{ paddingTop: 4, marginRight: 16 }}>
                        {this.state.my_wish ?
                          <ImageCon
                            image={require('../../assets/images/bookmark_pink_full.png')}
                          /> : <ImageCon
                            image={require('../../assets/images/bookmark_icon_pink.png')}
                          />}
                  </Button>
                  <AddSmallButton
                          onPress={() => this.createFiveCall()}
                          textTrue={'담김'}
                          textFalse={'+ 담기'}
                          clicked={this.state.my_five}
                    />
                  </View>
                  <Text note numberOfLines={2} style={{ marginTop: 12, marginLeft: 5, width: Constant.deviceWidth/2 }}>{this.state.five.subtitle}</Text>
                </View>
              </View>
            </Row>
            <FiveShowButtons
              five={this.state.five}
              category={this.state.category}
              modalNavigation={this.props.screenProps.modalNavigation}
            />
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
                    category={this.state.category}
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
                    borderRadius={6}
                    marginRight={24}
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
