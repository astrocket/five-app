import React, { Component } from 'react';
import {
  View, Alert, FlatList, RefreshControl, Linking, StatusBar,
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
import { FiveUnitRound, ImageCon } from '../../component/common';
import * as Images from '../../assets/images/Images';
import * as Constant from '../../config/Constant';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

import Icon from 'react-native-vector-icons/FontAwesome';

@inject('stores') @observer
export default class FiveShow extends Component {

  static navigationOptions = ({ navigation }) => ({
    header: null,
    statusBarStyle: 'dark-content',
  });

  constructor(props) {
    super(props);
    this.app = this.props.stores.app;
    this.server = this.props.stores.server;
    this.five = this.props.stores.five;
    this.state = {
      loading: true,
      refreshing: false,
      category: this.props.navigation.state.params.category,
      category_korean: Constant.CategoryToKorean(this.props.navigation.state.params.category),
      five: '',
      flip: false,
      five_users: [],
      five_users_count: '',
      my_five: false,
      my_wish: false,
      clicked: true,
      related_fives: [],
      wish_loading: false,
      five_loading: false
    };
  }

  componentDidMount() {
    this.five.fiveShow(this.state.category, this.props.navigation.state.params.id, (res) => {
      this.setState({
        five: res.data.five,
        five_users: res.data.five_users,
        five_users_count: res.data.five_users_count,
        my_five: res.data.my_five,
        my_wish: res.data.my_wish,
        related_fives: res.data.related_fives,
      });
    }).then(() => this.setState({ loading: false }))
  }

  _onRefresh() {
    this.setState({ refreshing: true }, () => {
      this.five.fiveShow(this.state.category, this.props.navigation.state.params.id, (res) => {
        this.setState({
          five: res.data.five,
          five_users: res.data.five_users,
          five_users_count: res.data.five_users_count,
          my_five: res.data.my_five,
          my_wish: res.data.my_wish,
          related_fives: res.data.related_fives,
        });
      }).then(() => this.setState({ refreshing: false }))
    });
  }

  toggleWishCall() {
    this.setState({ wish_loading: true }, () => {
      if (this.state.my_wish) {
        this.five.wishDestroy(this.state.category, this.state.five.id, (res) => {
          this.setState({ my_wish: false });
        }).then(() => this.setState({ wish_loading: false }));
      } else {
        this.five.wishCreate(this.state.category, this.state.five.id, (res) => {
          this.setState({ my_five: res.data.my_five, my_wish: res.data.my_wish, });
        }).then(() => this.setState({ wish_loading: false }));
      }
    });
  }

  toggleFiveCall() {
    this.setState({ five_loading: true }, () => {
      if (this.state.my_five) {
        this.five.fiveDestroy(this.state.category, this.state.five.id, (res) => {
          this.setState({ five_users_count: (this.state.five_users_count -= 1), my_five: false });
        }).then(() => this.setState({ five_loading: false }));
      } else {
        this.five.fiveCreate(this.state.category, this.state.five.id, (res) => {
          console.log(JSON.stringify(res.data.first_kiss));
          if (res.data.first_kiss) {
            this.app.updateCategories().then(() => {
              this.setState({ five_users_count: (this.state.five_users_count += 1), my_five: res.data.my_five, my_wish: res.data.my_wish, });
            });
          } else {
            this.setState({ five_users_count: (this.state.five_users_count += 1), my_five: res.data.my_five, my_wish: res.data.my_wish, });
          }
        }, (e) => {
          if (e.response.data.full && !this.state.my_wish) {
            this.askAddWish(JSON.stringify(e.response.data.errors[0]));
          } else {
            this.five.defaultErrorHandler(e)
          }
        }).then(() => this.setState({ five_loading: false }));
      }
    });
  }

  askAddWish(msg) {
    Alert.alert(
      `${msg}`,
      `${this.state.five.title}을(를) ${this.state.category_korean} 보관함에 담으시겠어요?`,
      [ { text: '아니요', style: 'cancel', },
        { text: '네', onPress: () => this.toggleWishCall() }, ],
      { cancelable: true },
    );
  }

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
                    alignItems: 'center'
                  }}>
                    <Text large numberOfLines={1} style={{ marginLeft: 2, width: Constant.deviceWidth/2 + 32}}>{this.state.five.title}</Text>
                    <View style={BaseStyle.headerDoubleIconsContainer}>
                      <Button onPress={() => this.toggleWishCall()} transparent style={{ marginRight: 16 }}>
                        {this.state.wish_loading ? null :
                          this.state.my_wish ?
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
                          onPress={() => this.toggleFiveCall()}
                          textTrue={'담김'}
                          textFalse={'+ 담기'}
                          clicked={this.state.my_five}
                          loading={this.state.five_loading}
                        />
                      </View>
                    </View>
                  </View>
                  <Text note numberOfLines={1} style={{ marginLeft: 3, width: Constant.deviceWidth/2 }}>{this.state.five.subtitle}</Text>
                </View>
              </View>
            </Row>
            <Row style = {{ height: 100 }}>
              <Col size={50}>
                <Button style={{
                  flex: 1,
                  backgroundColor: 'white',
                  height: 56,
                  width: Constant.deviceWidth / 2,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                }} onPress={() => this.props.screenProps.modalNavigation.navigate('ModalWebViewShow', {
                  url: this.state.five.related_link,
                  headerTitle: '가사 보기'
                })}
                >
                  <Icon name='align-left' 
                    style={{
                      color: Constant.LightGrey,
                      fontSize: 36,
                    }}
                  />
                </Button>
              </Col>
              <Col size={50}>
                <Button style={{
                  flex: 1,
                  backgroundColor: 'white',
                  height: 56,
                  width: Constant.deviceWidth / 2,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                }} onPress={() => this.props.screenProps.modalNavigation.navigate('ModalWebViewShow', {
                  url: this.state.five.youtube_link,
                  headerTitle: this.state.five.track_name
                })}
                >
                  <Icon name='youtube-square' 
                    style={{
                      color: Constant.LightGrey,
                      fontSize: 36,
                    }}
                  />
                </Button>
              </Col>
            </Row>
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
                    borderRadius={12}
                    marginRight={16}
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
