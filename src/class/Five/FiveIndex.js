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
import * as Constant from '../../config/Constant';
import * as Images from '../../assets/images/Images';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('stores') @observer
export default class FiveIndex extends Component {

  constructor(props) {
    super(props);
    this.app = this.props.stores.app;
    this.server = this.props.stores.server;
    this.app = this.props.stores.app;
    this.server = this.props.stores.server;
    this.state = {
      loading: true,
      refreshing: false,
      category: this.props.category,
      category_korean: Constant.CategoryToKorean(this.props.category),
      fives: [],
      my_wish_fives: [],
      follow_suggestions: [],
      challenge_fives: []
    };
  }

  componentDidMount() {
    this.server.fiveIndex(this.state.category, (data) => this.setState(data))
      .then(() => {
        this.setState({ loading: false });
      });
  }

  _onRefresh() {
    this.setState({ refreshing: true }, () => {
      this.server.fiveIndex(this.state.category, (data) => this.setState(data))
        .then(() => {
          this.app.updateCategories().then(() => {
            this.setState({ refreshing: false })
          });
        });
    });
  }

  toggleFollowCall(item, index) {
    this.onClickFollow(item, index)
      .then(() => {
        this.server.followPost(item.user.id, item.following, item.category, (res) => this.onSuccessFollow(res, index))
          .then(() => this.afterClickFollow(item, index));
      });
  }

  async onClickFollow(item, index) {
    const stateBefore = [ ...this.state.follow_suggestions ];
    stateBefore[ index ].loading = true;
    await this.setState({ follow_suggestions: stateBefore })
  }

  async afterClickFollow(item, index) {
    const stateBefore = [ ...this.state.follow_suggestions ];
    stateBefore[ index ].loading = false;
    await this.setState({ follow_suggestions: stateBefore })
  }

  onSuccessFollow(res, index) {
    const new_following = res.data;
    const stateBefore = [ ...this.state.follow_suggestions ];
    stateBefore[ index ].following = new_following;
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
              title={'친구들의 파이브 컬렉션'}
              onPress={() => navigation.navigate('FiveList', {
                category: this.state.category,
                fives: this.state.fives,
                title: `친구들의 ${this.state.category_korean} FIVE`,
              })}
              moreTitle={'모두보기'}
              sub={`업데이트된 친구들의 ${this.state.category_korean} 파이브를 확인해 보세요.`}
            />
            <Row>
              {this.state.fives.length > 0 ?
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={this.state.fives}
                  style={rowWrapper}
                  removeClippedSubviews={true}
                  renderItem={({ item }) => (
                    <FiveUnitFull
                      multiple
                      id={item.id}
                      category={item.category}
                      title={item.title}
                      subtitle={item.subtitle}
                      friends_info={item.friends_info}
                      image_url={item.image_large_url}
                      onPress={() => navigation.navigate('FiveShow', {
                        category: this.state.category, title: item.title,
                        suggest_title: `비슷한 종류의 FIVE ${this.state.category_korean}`,
                        id: item.id, navLoading: true
                      })}
                      borderRadius={8}
                      marginRight={16}
                      cardCut={80}
                    />
                  )}
                  keyExtractor={item => 'five-' + item.id}
                />
                :<EmptyBox
                  barWidth={Constant.deviceWidth}
                  message={`${this.state.category_korean} 친구를 팔로우하면${'\n'}여기에서 친구들의 ${this.state.category_korean} FIVE를 확인할 수 있어요.`}
                  barHeight={100}
                  borderRadius={10}
                  marginRight={0}
                />
              }
            </Row>
            <RowHeaderBar
              style={{ backgroundColor: '#fafafa' }}
              title={`${this.state.category_korean} 친구를 만들어 보세요.`}
              sub={`우연히 발견한 ${this.state.category_korean} 취향으로 인생친구가 될 수도?`}
            />
            <Row style={{ backgroundColor: '#fafafa' }}>
              {this.state.follow_suggestions.length > 0 ?
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={this.state.follow_suggestions}
                  style={rowWrapper}
                  removeClippedSubviews={true}
                  renderItem={({ item, index }) => (
                    <UserFivesBar
                      onPress={() => navigation.navigate('UserShow', { user: item.user })}
                      onPressFollow={() => this.toggleFollowCall(item, index)}
                      defaultImage={Images.default_main}
                      category={item.category}
                      fives={item.fives}
                      limit={item.fives.length < 3}
                      clicked={item.following}
                      loading={item.loading}
                      user={item.user}
                    />
                  )}
                  keyExtractor={item => 'user-fives-' + item.user.id}
                />
                : <EmptyBox
                  barWidth={Constant.deviceWidth}
                  message={`아직 추천 해드릴 ${this.state.category_korean} 팔로워가 없네요.`}
                  barHeight={100}
                  borderRadius={10}
                  marginRight={0}
                />
              }
            </Row>
            <RowHeaderBar
              title={`내가 보관해 둔 ${this.state.category_korean}`}
              onPress={() => navigation.navigate('ProfileWishIndex', {
                initialCategory: this.state.category
              })}
              moreTitle={'모두보기'}
            />
            <Row>
              {this.state.my_wish_fives.length > 0 ?
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={this.state.my_wish_fives}
                  style={rowWrapper}
                  removeClippedSubviews={true}
                  renderItem={({ item }) => (
                    <FiveUnitRound
                      category={this.state.category}
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
                      borderRadius={(this.state.category === 'book' ? 4 : 12)}
                      marginRight={24}
                    />
                  )}
                  keyExtractor={item => 'wish-five-' + item.id}
                />
                :<EmptyBox
                  barWidth={Constant.deviceWidth}
                  message={`아직 보관한 ${this.state.category_korean}이 없으시네요.`}
                  barHeight={100}
                  borderRadius={10}
                  marginRight={0}
                />
              }

            </Row>
            <RowHeaderBar
              title={`이런 ${this.state.category_korean}은 어떠세요?`}
              sub={`지금 누군가의 FIVE로 선택된 ${this.state.category_korean}입니다.`}
            />
            <Row>
              {this.state.challenge_fives.length > 0 ?
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={this.state.challenge_fives}
                  style={rowWrapper}
                  removeClippedSubviews={true}
                  renderItem={({ item }) => (
                    <FiveUnitRound
                      category={this.state.category}
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
                      borderRadius={(this.state.category === 'book' ? 4 : 12)}
                      marginRight={24}
                    />
                  )}
                  keyExtractor={item => 'five-challenge-' + item.id}
                />
                :<EmptyBox
                  barWidth={Constant.deviceWidth}
                  message={`아직 추천 해드릴 ${this.state.category_korean}이 없네요.`}
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
