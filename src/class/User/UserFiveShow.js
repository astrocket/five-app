import React, { Component } from 'react';
import {
  View, FlatList, RefreshControl
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
  FiveUnitBar, FiveUnitFull,
} from '../../component/common';
import { FollowSmallButton } from '../../component/common';
import axios from 'axios';
import { NavigationActions } from 'react-navigation';
import * as Images from '../../assets/images/Images';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('ApplicationStore') // Inject some or all the stores!
@observer
export default class UserFiveShow extends Component {

  static navigationOptions = ({ navigation }) => ({
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
              onPress={navigation.state.params.toggleFollow}
              textTrue={'팔로잉'}
              textFalse={'팔로우'}
              clicked={navigation.state.params.following}
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
      user: this.props.navigation.state.params.user,
      flip: true,
      clicked: false,
      fives: [],
      followers_count: '',
      followees_count: '',
      following: false,
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({
      openShareActionSheet: () => this.openShareActionSheet(),
      toggleFollow: () => this.toggleFollow(),
    });
    this.apiCall();
  }

  async apiCall() {
    const config = {
      headers: {
        'X-User-Email': this.props.ApplicationStore.email,
        'X-User-Token': this.props.ApplicationStore.token,
      },
    };
    await axios.get(`${ApiServer.USERS}/${this.props.navigation.state.params.user.id}/fives?category=${this.props.navigation.state.params.five_category}`, config)
      .then((response) => {
        this.props.navigation.setParams({
          following: response.data.following,
          navLoading: false,
        });
        this.setState({
          loading: false,
          klass: response.data.klass,
          category: response.data.category,
          fives: response.data.fives,
          followers_count: response.data.followers_count,
          followees_count: response.data.followees_count,
          following: response.data.following,
        });
      })
      .catch((error) => {
        console.log('에러 : ' + error.response);
      });
  }

  _onRefresh() {
    this.setState({refreshing: true});
    this.apiCall().then(() => {
      this.setState({refreshing: false});
    });
  }

  openShareActionSheet() {
    const BUTTONS = [ '카카오톡 공유하기', 'Cancel' ];
    const CANCEL_INDEX = 1;

    ActionSheet.show(
      {
        options: BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
      },
      buttonIndex => this.shareAction(BUTTONS[buttonIndex]),
    );
  }

  shareAction(value) {
    Toast.show({
      text: value,
      position: 'bottom',
      duration: 1500
    })
  }

  followCall(category, data, onSuccess) {
    const header = {
      headers: {
        'X-User-Email': this.props.ApplicationStore.email,
        'X-User-Token': this.props.ApplicationStore.token,
      },
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

  toggleFollow() {
    const data = {
      following: {
        user_id: this.state.user.id,
        following: !this.state.following,
      },
    };
    this.followCall(this.state.klass.toLowerCase(), data, (response) => this.onFollowSuccess(response));
  }

  onFollowSuccess(response) {
    const new_following = response.data;
    this.setState({
      following: new_following,
      followers_count: new_following ? this.state.followers_count += 1 : this.state.followers_count -= 1,
    });
    this.props.navigation.setParams({ following: new_following });
  }

  flipCard() {
    this.setState({
      flip: !this.state.flip,
    });
  }

  renderFlipButton(flip) {
    if (flip) {
      return (
        <Button onPress={() => this.flipCard()} transparent>
          <Icon
            name="md-photos"
            style={{
              fontSize: 25,
              color: '#000',
            }}
          />
        </Button>
      );
    } else {
      return (
        <Button onPress={() => this.flipCard()} transparent>
          <Icon
            name="md-reorder"
            style={{
              fontSize: 25,
              color: '#000',
            }}
          />
        </Button>
      );
    }
  }

  renderCard(flip) {
    const { navigation } = this.props;
    const { rowWrapper } = BaseStyle;

    if (flip) {
      return (
        <Row key={1}>
          <FlatList
            data={this.state.fives}
            renderItem={({ item }) => (
              <FiveUnitBar
                multiple
                id={item.id}
                title={item.title}
                location={item.location}
                image_url={item.image_medium_url}
                icon={'ios-arrow-forward-outline'}
                onPress={() => navigation.navigate(`${this.state.klass}Show`, {
                  title: item.title,
                  id: item.id,
                })}
              />
            )}
            keyExtractor={item => 'five-bar-list-' + item.id}
          />
        </Row>
      );
    } else {
      return (
        <Row key={2}>
          <FlatList
            data={this.state.fives}
            style={rowWrapper}
            renderItem={({ item }) => (
              <FiveUnitFull
                multiple
                id={item.id}
                location={item.location}
                title={item.title}
                image_url={item.image_large_url}
                onPress={() => navigation.navigate(`${this.state.klass}Show`, {
                  title: item.title,
                  id: item.id,
                })}
                barWidth={null}
                barHeight={null}
                borderRadius={15}
                marginRight={0}
              />
            )}
            keyExtractor={item => 'five-full-list-' + item.id}
          />
        </Row>
      );
    }
  }

  render() {
    const { container, preLoading } = BaseStyle;
    const { navigation } = this.props;

    return (
      <Container>
        <Content refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }>
          <Row style={{
            flexDirection: 'column',
            padding: 10,
          }}>
            <Text style={{ marginBottom: 5 }}>{this.state.user.name}의</Text>
            <Text large>{this.state.category} 파이브</Text>
          </Row>
          <Row style={{
            paddingBottom: 10,
            marginBottom: 5,
          }}>
            <Col size={2} style={{ justifyContent: 'center' }}>
              <View style={{ flexDirection: 'row' }}>
                <Button transparent style={{
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  marginRight: 5,
                }} onPress={() => navigation.navigate('UserFollowerIndex', {
                  five_category: navigation.state.params.five_category,
                  user: navigation.state.params.user,
                })}>
                  <Text small
                        style={{ marginRight: 0 }}>{Number(this.state.followers_count).toLocaleString()}</Text>
                  <Text note>{'Follower'}</Text>
                </Button>
                <Button transparent style={{
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  marginRight: 5,
                }} onPress={() => navigation.navigate('UserFolloweeIndex', {
                  five_category: navigation.state.params.five_category,
                  user: navigation.state.params.user,
                })}>
                  <Text small
                        style={{ marginRight: 0 }}>{Number(this.state.followees_count).toLocaleString()}</Text>
                  <Text note>{'Following'}</Text>
                </Button>
              </View>
            </Col>
            {/*<Col size={1} style={{ alignItems: 'flex-end' }}>
              <View>
                {this.renderFlipButton(this.state.flip)}
              </View>
            </Col>*/}
          </Row>
          {this.renderCard(this.state.flip)}
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