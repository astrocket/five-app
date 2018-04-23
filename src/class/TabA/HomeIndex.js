import React, { Component } from 'react';
import {
  StyleSheet, View, FlatList, RefreshControl, Alert,
} from 'react-native';
import {
  Container, Content, Spinner, Toast,
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import * as Constant from '../../config/Constant';
import {
  RowHeaderBar, FiveStoryFull, FiveUnitRound, UserFivesBar,
} from '../../component/common';
import * as Images from '../../assets/images/Images';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('stores') @observer
export default class HomeIndex extends Component {

  static navigationOptions = ({ navigation }) => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.app = this.props.stores.app;
    this.server = this.props.stores.server;
    this.state = {
      loading: true, //실서비스에서는 로딩 true로
      five_story: [],
      popular_fives: [],
      follow_suggestions: [],
      refreshing: false,
    };
  }

  componentDidMount() {
    this.server.homeIndex((data) => this.setState(data))
      .then(() => {
        this.setState({ loading: false });
      });
  }

  _onRefresh() {
    this.setState({ refreshing: true }, () => {
      this.server.homeIndex((data) => this.setState(data))
        .then(() => {
          this.app.updateCategories().then(() => {
            this.setState({ refreshing: false });
          });
        });
    });
  }

  toggleFollowCall(item, index) {
    this.onClickFollow(item, index)
      .then(() => {
        const have = this.app.hasCategory(item.category);
        if (have) {
          this.server.followPost(item.user.id, item.following, item.category, (res) => this.onSuccessFollow(res, index))
            .then(() => this.afterClickFollow(item, index));
        } else {
          Alert.alert(
            `아직 참여한 카테고리는 아니에요`,
            `${Constant.askToParticipate(item.category_korean, item.user.name)}`,
            [ {
              text: '네',
              onPress: () => this.server.followPost(item.user.id, item.following, item.category, (res) => this.onSuccessFollow(res, index))
                .then(() => this.afterClickFollow(item, index)
                  .then(() => this.props.navigation.navigate(`SearchFive`, { category: item.category, category_korean: item.category_korean, klass: item.klass})))
            },
              { text: '취소', style: 'cancel'},
            ], { cancelable: true },
          );
        }
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
            tintColor={Constant.FiveColor}
          />
        }>
          <Grid>
            <Row style={{
              padding: 16,
              backgroundColor: '#fafafa',
            }}>
              <Row style={{
                padding: 0,
                backgroundColor: 'white',
                borderRadius: 24,
              }}
              >
                <FiveStoryFull
                  singleClickable
                  id={this.state.five_story.id}
                  title={this.state.five_story.title}
                  subtitle={this.state.five_story.subtitle}
                  image_url={this.state.five_story.image_large_url}
                  onPress={() => navigation.navigate('FiveStoryShow', {
                    title: this.state.five_story.title,
                    id: this.state.five_story.id,
                    five_story: this.state.five_story,
                  })}
                  barWidth={null}
                  barHeight={null}
                  borderRadius={10}
                  margin={0}
                />
              </Row>
            </Row>
            <RowHeaderBar
              style={{ backgroundColor: '#fafafa' }}
              title={'음악 팔로우 제안'}
            />
            <Row style={{ backgroundColor: '#fafafa' }}>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={this.state.follow_suggestions}
                style={rowWrapper}
                renderItem={({ item, index }) => (
                  <UserFivesBar
                    onPress={() => navigation.navigate('UserShow', {
                      user: item.user,
                    })}
                    defaultImage={require('../../assets/images/five_void_grey.png')}
                    onPressFollow={() => this.toggleFollowCall(item, index)}
                    category={item.category}
                    fives={item.fives}
                    clicked={item.following}
                    loading={item.loading}
                    user={item.user}
                  />
                )}
                keyExtractor={item => 'user-fives-' + item.category + item.user.id}
              />
            </Row>
            <RowHeaderBar
              title={'당신을 위한 음악 제안'}
            />
            <Row>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={this.state.popular_fives}
                style={rowWrapper}
                renderItem={({ item }) => (
                  <FiveUnitRound
                    id={item.five.id}
                    title={item.five.title}
                    subtitle={item.five.subtitle}
                    five_users_count={item.five.five_users_count}
                    image_url={item.five.image_medium_url}
                    onPress={() => navigation.navigate('FiveShow', {
                      category: item.five.category,
                      title: item.five.title,
                      id: item.five.id,
                      navLoading: true,
                    })}
                    barWidth={164}
                    barHeight={156}
                    borderRadius={16}
                    marginRight={0}
                  />
                )}
                keyExtractor={item => `popular-${item.five.klass}-fives-` + item.five.id}
              />
            </Row>
          </Grid>

          <Grid>
            <Row
              style={{
                height: 32,
                backgroundColor: '#fafafa',
              }}
            />
            <Row style={{
              padding: 16,
              backgroundColor: '#fafafa',
            }}>
              <Row style={{
                padding: 0,
                backgroundColor: 'white',
                borderRadius: 24,
              }}
              >
                <FiveStoryFull
                  singleClickable
                  id={this.state.five_story.id}
                  title={this.state.five_story.title}
                  subtitle={this.state.five_story.subtitle}
                  image_url={this.state.five_story.image_large_url}
                  onPress={() => navigation.navigate('FiveStoryShow', {
                    title: this.state.five_story.title,
                    id: this.state.five_story.id,
                    five_story: this.state.five_story,
                  })}
                  barWidth={null}
                  barHeight={null}
                  borderRadius={10}
                  margin={0}
                />
              </Row>
            </Row>
            <RowHeaderBar
              style={{ backgroundColor: '#fafafa' }}
              title={'책 팔로우 제안'}
            />
            <Row style={{ backgroundColor: '#fafafa' }}>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={this.state.follow_suggestions}
                style={rowWrapper}
                renderItem={({ item, index }) => (
                  <UserFivesBar
                    onPress={() => navigation.navigate('UserShow', {
                      user: item.user,
                    })}
                    defaultImage={require('../../assets/images/five_void_grey.png')}
                    onPressFollow={() => this.toggleFollowCall(item, index)}
                    category={item.category}
                    fives={item.fives}
                    clicked={item.following}
                    user={item.user}
                  />
                )}
                keyExtractor={item => 'user-fives-' + item.category + item.user.id}
              />
            </Row>
            <RowHeaderBar
              title={'당신을 위한 책 제안'}
            />
            <Row>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={this.state.popular_fives}
                style={rowWrapper}
                renderItem={({ item }) => (
                  <FiveUnitRound
                    id={item.five.id}
                    title={item.five.title}
                    subtitle={item.five.subtitle}
                    five_users_count={item.five.five_users_count}
                    image_url={item.five.image_medium_url}
                    onPress={() => navigation.navigate('FiveShow', {
                      category: item.five.category,
                      title: item.five.title,
                      id: item.five.id,
                      navLoading: true,
                    })}
                    barWidth={164}
                    barHeight={156}
                    borderRadius={16}
                    marginRight={0}
                  />
                )}
                keyExtractor={item => `popular-${item.five.klass}-fives-` + item.five.id}
              />
            </Row>
          </Grid>

          <Grid>
            <Row
              style={{
                height: 32,
                backgroundColor: '#fafafa',
              }}
            />
            <Row style={{
              padding: 16,
              backgroundColor: '#fafafa',
            }}>
              <Row style={{
                padding: 0,
                backgroundColor: 'white',
                borderRadius: 24,
              }}
              >
                <FiveStoryFull
                  singleClickable
                  id={this.state.five_story.id}
                  title={this.state.five_story.title}
                  subtitle={this.state.five_story.subtitle}
                  image_url={this.state.five_story.image_large_url}
                  onPress={() => navigation.navigate('FiveStoryShow', {
                    title: this.state.five_story.title,
                    id: this.state.five_story.id,
                    five_story: this.state.five_story,
                  })}
                  barWidth={null}
                  barHeight={null}
                  borderRadius={10}
                  margin={0}
                />
              </Row>
            </Row>
            <RowHeaderBar
              style={{ backgroundColor: '#fafafa' }}
              title={'영화 팔로우 제안'}
            />
            <Row style={{ backgroundColor: '#fafafa' }}>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={this.state.follow_suggestions}
                style={rowWrapper}
                renderItem={({ item, index }) => (
                  <UserFivesBar
                    onPress={() => navigation.navigate('UserShow', {
                      user: item.user,
                    })}
                    defaultImage={require('../../assets/images/five_void_grey.png')}
                    onPressFollow={() => this.toggleFollowCall(item, index)}
                    category={item.category}
                    fives={item.fives}
                    clicked={item.following}
                    user={item.user}
                  />
                )}
                keyExtractor={item => 'user-fives-' + item.category + item.user.id}
              />
            </Row>
            <RowHeaderBar
              title={'당신을 위한 영화 제안'}
            />
            <Row>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={this.state.popular_fives}
                style={rowWrapper}
                renderItem={({ item }) => (
                  <FiveUnitRound
                    id={item.five.id}
                    title={item.five.title}
                    subtitle={item.five.subtitle}
                    five_users_count={item.five.five_users_count}
                    image_url={item.five.image_medium_url}
                    onPress={() => navigation.navigate('FiveShow', {
                      category: item.five.category,
                      title: item.five.title,
                      id: item.five.id,
                      navLoading: true,
                    })}
                    barWidth={164}
                    barHeight={156}
                    borderRadius={16}
                    marginRight={0}
                  />
                )}
                keyExtractor={item => `popular-${item.five.klass}-fives-` + item.five.id}
              />
            </Row>
          </Grid>

        </Content>
        {this.state.loading &&
        <View style={preLoading}>
          <Spinner size='large' color={Constant.FiveColor}/>
        </View>
        }
      </Container>
    );
  }
}