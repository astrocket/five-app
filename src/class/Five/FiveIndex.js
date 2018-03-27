import React, { Component } from 'react';
import {
  View, RefreshControl, FlatList,
} from 'react-native';
import {
  Container, Content, Spinner, Toast,
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import {
  RowHeaderBar, FiveUnitRound, UserFivesBar, FiveUnitFull, EmptyBox,
} from '../../component/common';
import axios from 'axios';
import * as Constant from '../../config/Constant';
import * as Images from '../../assets/images/Images';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('ApplicationStore') // Inject some or all the stores!
@observer
export default class FiveIndex extends Component {

  state = {
    loading: true,
    refreshing: false,
    category: this.props.category,
    category_korean: Constant.CategoryToKorean(this.props.category),
    header: {
      headers: {
        'X-User-Email': this.props.ApplicationStore.email,
        'X-User-Token': this.props.ApplicationStore.token,
      },
    },
    fives: [],
    my_wish_fives: [],
    follow_suggestions: [],
    challenge_fives: []
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
    await axios.get(Constant.CategoryToApi(this.state.category), this.state.header)
      .then((response) => {
        const { fives, my_wish_fives, follow_suggestions, challenge_fives } = response.data;
        this.setState({
          loading: false, fives, my_wish_fives, follow_suggestions, challenge_fives
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

    axios.post(`${ApiServer.FOLLOWINGS}/?category=${item.category}`, data, this.state.header)
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
              onPress={() => navigation.navigate('FiveList', {
                category: this.state.category,
                fives: this.state.fives,
                title: '친구들의 five'
              })}
              moreTitle={'모두보기'}
            />
            <Row>
              {this.state.fives.length > 0 ?
                <FlatList
                  horizontal
                  data={this.state.fives}
                  style={rowWrapper}
                  renderItem={({ item }) => (
                    <FiveUnitFull
                      multiple
                      id={item.id}
                      title={item.title}
                      subtitle={item.subtitle}
                      friends_info={item.friends_info}
                      image_url={item.image_large_url}
                      onPress={() => navigation.navigate('FiveShow', {
                        category: this.state.category, title: item.title,
                        suggest_title: `비슷한 종류의 FIVE ${this.state.category_korean}`,
                        id: item.id, navLoading: true
                      })}
                      borderRadius={15}
                      marginRight={10}
                      cardCut={80}
                    />
                  )}
                  keyExtractor={item => 'five-' + item.id}
                />
                :<EmptyBox
                  barWidth={Constant.deviceWidth - 20}
                  message={`${this.state.category_korean} 친구를 팔로우하면${'\n'}이 곳에서 친구들의 ${this.state.category_korean} FIVE를 확인할 수 있어요.`}
                  barHeight={100}
                  borderRadius={10}
                  marginRight={0}
                />
              }
            </Row>
            <RowHeaderBar
              style={{ backgroundColor: '#fafafa' }}
              title={'팔로우 추천'}
            />
            <Row style={{ backgroundColor: '#fafafa' }}>
              {this.state.follow_suggestions.length > 0 ?
                <FlatList
                  horizontal
                  data={this.state.follow_suggestions}
                  style={rowWrapper}
                  renderItem={({ item, index }) => (
                    <UserFivesBar
                      onPress={() => navigation.navigate('UserShow', { user: item.user })}
                      onPressFollow={() => this.followCall(item, index)}
                      defaultImage={Images.findImageOf(item.category)}
                      category={item.category}
                      fives={item.fives}
                      clicked={item.following}
                      user={item.user}
                    />
                  )}
                  keyExtractor={item => 'user-fives-' + item.user.id}
                />
                : <EmptyBox
                  barWidth={Constant.deviceWidth - 20}
                  message={`아직 추천 해드릴 ${this.state.category_korean} 팔로워가 없네요.`}
                  barHeight={100}
                  borderRadius={10}
                  marginRight={0}
                />
              }
            </Row>
            <RowHeaderBar
              title={`내가 클립해 둔 ${this.state.category_korean}`}
              onPress={() => navigation.navigate('ProfileWishIndex')}
              moreTitle={'모두보기'}
            />
            <Row>
              {this.state.my_wish_fives.length > 0 ?
                <FlatList
                  horizontal
                  data={this.state.my_wish_fives}
                  style={rowWrapper}
                  renderItem={({ item }) => (
                    <FiveUnitRound
                      id={item.id}
                      subtitle={item.subtitle}
                      title={item.title}
                      five_users_count={item.five_users_count}
                      image_url={item.image_medium_url}
                      onPress={() => navigation.navigate('FiveShow', {
                        category: this.state.category, title: item.title,
                        suggest_title: `비슷한 종류의 FIVE ${this.state.category_korean}`,
                        id: item.id, navLoading: true
                      })}
                      barWidth={150}
                      barHeight={150}
                      borderRadius={15}
                      marginRight={10}
                    />
                  )}
                  keyExtractor={item => 'wish-five-' + item.id}
                />
                :<EmptyBox
                  barWidth={Constant.deviceWidth - 20}
                  message={`아직 클립에 담은 ${this.state.category_korean}이 없으시네요.`}
                  barHeight={100}
                  borderRadius={10}
                  marginRight={0}
                />
              }

            </Row>
            <RowHeaderBar
              title={`추천 ${this.state.category_korean}(당신의 FIVE에 도전)`}
            />
            <Row>
              {this.state.challenge_fives.length > 0 ?
                <FlatList
                  horizontal
                  data={this.state.challenge_fives}
                  style={rowWrapper}
                  renderItem={({ item }) => (
                    <FiveUnitRound
                      id={item.id}
                      subtitle={item.subtitle}
                      title={item.title}
                      five_users_count={item.five_users_count}
                      image_url={item.image_medium_url}
                      onPress={() => navigation.navigate('FiveShow', {
                        category: this.state.category, title: item.title,
                        suggest_title: `비슷한 종류의 FIVE ${this.state.category_korean}`,
                        id: item.id, navLoading: true
                      })}
                      barWidth={150}
                      barHeight={150}
                      borderRadius={15}
                      marginRight={10}
                    />
                  )}
                  keyExtractor={item => 'five-challenge-' + item.id}
                />
                :<EmptyBox
                  barWidth={Constant.deviceWidth - 20}
                  message={`아직 추천 해드릴 도전 FIVE가 없네요.`}
                  barHeight={100}
                  borderRadius={10}
                  marginRight={0}
                />
              }

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
