import React, { Component } from 'react';
import {
  View, FlatList, RefreshControl, TouchableOpacity, Alert,
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
import { FollowSmallButton, ImageCon } from '../../component/common';
import axios from 'axios';
import { NavigationActions } from 'react-navigation';
import * as Images from '../../assets/images/Images';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('ApplicationStore')
@observer
export default class UserFiveShow extends Component {

  static navigationOptions = ({ navigation }) => ({
    headerLeft: (
      <Button transparent onPress={() => navigation.goBack()}>
        <ImageCon
          image={require('../../assets/images/back_icon_pink.png')}
        />
      </Button>
    ),
    headerRight: (
      navigation.state.params.navLoading ?
        null :
        <View style={BaseStyle.headerDoubleIconsContainer}>
{/*          <Button onPress={navigation.state.params.openShareActionSheet} transparent>
            <Icon
              name="ios-share-outline"
              style={{
                fontSize: 25,
                color: Constant.FiveColor,
              }}
            />
          </Button>*/}
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
      header: {
        headers: {
          'X-User-Email': this.props.ApplicationStore.email,
          'X-User-Token': this.props.ApplicationStore.token,
        },
      },
      category: this.props.navigation.state.params.category,
      klass: '',
      user: this.props.navigation.state.params.user,
      flip: false,
      clicked: false,
      fives: [],
      followers_count: '',
      followees_count: '',
      following: false,
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({
      toggleFollow: () => this.toggleFollow(),
    });
    this.apiCall();
  }

  async apiCall() {
    await axios.get(`${ApiServer.USERS}/${this.props.navigation.state.params.user.id}/fives?category=${this.state.category}`, this.state.header)
      .then((response) => {
        this.props.navigation.setParams({
          following: response.data.following,
          navLoading: false,
        });
        this.setState({
          loading: false,
          klass: response.data.klass,
          category_korean: response.data.category_korean,
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

  askFollowOption(data, onSuccess) {
    this.props.ApplicationStore.hasCategory(this.state.category).then((have) => {
      if (have) {
        this.followCall(data, onSuccess);
      } else {
        Alert.alert(
          `아직 참여한 카테고리는 아니에요`,
          `${this.state.user.name}님을 팔로우 하고 함께 ${this.state.category_korean} 카테고리에 참여하러 가시겠어요?`,
          [
            {
              text: '네',
              onPress: () => this.followCall(data, onSuccess).then(() => {
                this.props.navigation.navigate(`ProfileFiveAdd${this.state.klass}`, {
                  category: this.state.category,
                });
              }),
            },
            {
              text: '취소',
              style: 'cancel',
            },
          ],
          { cancelable: true },
        );
      }
    });
  }

  async followCall(data, onSuccess) {

  await axios.post(`${ApiServer.FOLLOWINGS}/?category=${this.state.category}`, data, this.state.header)
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
    this.askFollowOption(data, (response) => this.onFollowSuccess(response));
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
                subtitle={item.subtitle}
                friends_info={`FIVE ${item.five_users_count}`}
                image_url={item.image_medium_url}
                icon={'ios-arrow-forward-outline'}
                onPress={() => navigation.navigate('FiveShow', {
                  category: item.category,
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
            horizontal
            showsHorizontalScrollIndicator={false}
            data={this.state.fives}
            style={rowWrapper}
            renderItem={({ item }) => (
              <FiveUnitFull
                multiple
                id={item.id}
                subtitle={item.subtitle}
                title={item.title}
                friends_info={`FIVE ${item.five_users_count}`}
                image_url={item.image_large_url}
                onPress={() => navigation.navigate('FiveShow', {
                  category: item.category,
                  title: item.title,
                  id: item.id,
                })}
                borderRadius={15}
                marginRight={10}
                cardCut={80}
              />
            )}
            keyExtractor={item => 'five-full-list-' + item.id}
          />
        </Row>
      );
    }
  }

  render() {
    const { container, preLoading, rowFlexCenterCenter } = BaseStyle;
    const { navigation } = this.props;

    return (
      <Container>
        <Content refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }>
          <View>
            <View style={rowFlexCenterCenter}>
              <Text grey>{this.state.user.name}의</Text>
            </View>
            <View style={rowFlexCenterCenter}>
              <Text large>{this.state.category_korean} </Text>
              <Text large thin>파이브</Text>
            </View>
            <View style={rowFlexCenterCenter}>
              <TouchableOpacity transparent style={{
                flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', margin: 10
              }} onPress={() => navigation.navigate('UserFollowerIndex', { category: this.state.category, user: navigation.state.params.user})}>
                <Text small grey>{'Follower '}</Text>
                <Text small primary>{Number(this.state.followers_count).toLocaleString()}</Text>
              </TouchableOpacity>
              <TouchableOpacity transparent style={{
                flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: 10
              }} onPress={() => navigation.navigate('UserFolloweeIndex', { category: this.state.category, user: navigation.state.params.user})}>
                <Text small grey>{'Following '}</Text>
                <Text small primary>{Number(this.state.followees_count).toLocaleString()}</Text>
              </TouchableOpacity>
              <View style={{ width: 50 }}>
                {this.renderFlipButton(this.state.flip)}
              </View>
            </View>
          </View>
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
