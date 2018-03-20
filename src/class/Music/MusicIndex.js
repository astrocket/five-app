import React, { Component } from 'react';
import {
  View,
  TouchableOpacity, RefreshControl,
  FlatList,
} from 'react-native';
import {
  Container, Content, Spinner, Toast,
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import {
  RowHeaderBar, FiveUnitRound, UserFivesBar, FiveUnitFull
} from '../../component/common';
import axios from 'axios';
import * as Constant from '../../config/Constant';
import * as Images from '../../assets/images/Images';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('ApplicationStore') // Inject some or all the stores!
@observer
export default class MusicIndex extends Component {

  state = {
    loading: true,
    refreshing: false,
    musics: [],
    users: [],
    my_wish_musics: [],
    follow_suggestions: [],
    challenge_musics: []
  };

  componentDidMount() {
    this.apiCall();
  }

  _onRefresh() {
    this.setState({refreshing: true});
    this.apiCall().then(() => {
      this.setState({refreshing: false});
    });
  }

  async apiCall() {
    const config = { headers: {
        'X-User-Email': this.props.ApplicationStore.email,
        'X-User-Token': this.props.ApplicationStore.token}};
    await axios.get(ApiServer.MUSICS, config)
      .then((response) => {
        const { musics, users, my_wish_musics, follow_suggestions, challenge_musics } = response.data;
        this.setState({
          loading: false, musics, users, my_wish_musics, follow_suggestions, challenge_musics
        })
      }).catch((error) => {
        console.log(error.response);
      });
  }

  followCall(item, index) {
    const data = {
      following: {
        user_id: item.user.id,
        following: !item.following,
      },
    };

    const header = { headers: {
      'X-User-Email': this.props.ApplicationStore.email,
      'X-User-Token': this.props.ApplicationStore.token}};

    axios.post(`${ApiServer.FOLLOWINGS}/?category=${item.klass.toLowerCase()}`, data, header)
      .then((response) => {
        this.onCreateFollowCallSuccess(response, index);
      }).catch((error) => {
      console.log(error.response);
      Toast.show({
        text: JSON.stringify(error.response.data),
        position: 'bottom',
        duration: 1500,
      });
    });
  }

  onCreateFollowCallSuccess(response, index) {
    const new_following = response.data;
    const stateBefore = [...this.state.follow_suggestions];
    stateBefore[index].following = new_following;
    this.setState({ follow_suggestions: stateBefore });
  }

  render() {
    const { container, preLoading, rowWrapper } = BaseStyle;
    const { navigation } = this.props;

    return (
      <Container>
        <Content onScroll={this.props.onScroll} refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }>
          <Grid>
            <RowHeaderBar
              title={'친구들의 five'}
              onPress={() => navigation.navigate('MusicList', {
                musics: this.state.musics,
                title: '친구들의 five'
              })}
              moreTitle={'모두보기'}
            />
            <Row>
              <FlatList
                horizontal
                data={this.state.musics}
                style={rowWrapper}
                renderItem={({ item }) => (
                  <FiveUnitFull
                    multiple
                    id={item.id}
                    title={item.title}
                    subtitle={item.subtitle}
                    friends_info={item.friends_info}
                    image_url={item.image_large_url}
                    onPress={() => navigation.navigate('MusicShow', { title: item.title, id: item.id, navLoading: true })}
                    borderRadius={15}
                    marginRight={10}
                    cardCut={80}
                  />
                )}
                keyExtractor={item => 'music-' + item.id}
              />
            </Row>
            <RowHeaderBar
              style={{ backgroundColor: '#fafafa' }}
              title={'팔로우 추천'}
            />
            <Row style={{ backgroundColor: '#fafafa' }}>
              <FlatList
                horizontal
                data={this.state.follow_suggestions}
                style={rowWrapper}
                renderItem={({ item, index }) => (
                  <UserFivesBar
                    onPress={() => navigation.navigate('UserShow', { user: item.user ,category_data: item, five_category: item.klass.toLowerCase(), navLoading: true })}
                    onPressFollow={() => this.followCall(item, index)}
                    defaultImage={Images.findImageOf(item.category)}
                    clicked={item.following}
                    category={item.category}
                    followers={item.followers_count}
                    followees={item.followees_count}
                    fives={item.fives}
                    user={item.user}
                  />
                )}
                keyExtractor={item => 'user-fives-' + item.id}
              />
            </Row>
            <RowHeaderBar
              title={'내가 클립해 둔 음악'}
              onPress={() => navigation.navigate('ProfileWishIndex')}
              moreTitle={'모두보기'}
            />
            <Row>
              <FlatList
                horizontal
                data={this.state.my_wish_musics}
                style={rowWrapper}
                renderItem={({ item }) => (
                  <FiveUnitRound
                    id={item.id}
                    subtitle={item.subtitle}
                    title={item.title}
                    five_users_count={item.five_users_count}
                    image_url={item.image_medium_url}
                    onPress={() => navigation.navigate('MusicShow', { title: item.title, id: item.id, navLoading: true })}
                    barWidth={150}
                    barHeight={150}
                    borderRadius={15}
                    marginRight={10}
                  />
                )}
                keyExtractor={item => 'wish-music-' + item.id}
              />
            </Row>
            <RowHeaderBar
              title={'추천 음악(당신의 FIVE에 도전)'}
            />
            <Row>
              <FlatList
                horizontal
                data={this.state.challenge_musics}
                style={rowWrapper}
                renderItem={({ item }) => (
                  <FiveUnitRound
                    id={item.id}
                    subtitle={item.subtitle}
                    title={item.title}
                    five_users_count={item.five_users_count}
                    image_url={item.image_medium_url}
                    onPress={() => navigation.navigate('MusicShow', { title: item.title, id: item.id, navLoading: true })}
                    barWidth={150}
                    barHeight={150}
                    borderRadius={15}
                    marginRight={10}
                  />
                )}
                keyExtractor={item => 'music-challenge-' + item.id}
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
