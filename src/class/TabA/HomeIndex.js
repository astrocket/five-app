import React, { Component } from 'react';
import {
  StyleSheet, View, FlatList, RefreshControl, Alert, Text,
} from 'react-native';
import {
  Container, Content, Spinner, Toast, Button,
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

import Icon from 'react-native-vector-icons/FontAwesome';

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
      home_categories: [],
      refreshing: false,
      showToast: false,
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

  toggleFollowCall(item, index, category_index) {
    this.onClickFollow(item, index, category_index)
      .then(async () => {
        const have = await this.app.hasCategory(item.category);
        if (have) {
          this.server.followPost(item.user.id, item.following, item.category, (res) => this.onSuccessFollow(res, index, category_index))
            .then(() => this.afterClickFollow(item, index, category_index));
        } else {
          Alert.alert(
            `아직 참여한 카테고리는 아니에요`,
            `${Constant.askToParticipate(item.category_korean, item.user.name)}`,
            [ {
              text: '네',
              onPress: () => this.server.followPost(item.user.id, item.following, item.category, (res) => this.onSuccessFollow(res, index, category_index))
                .then(() => this.afterClickFollow(item, index, category_index)
                  .then(() => this.props.navigation.navigate(`SearchFive`, { category: item.category, category_korean: item.category_korean, klass: item.klass})))
            },
              { text: '취소', style: 'cancel', onPress: () => this.afterClickFollow(item, index, category_index)},
            ], { cancelable: true },
          );
        }
      });
  }

  async onClickFollow(item, follow_index, category_index) {
    await this.setState({
      home_categories: this.state.home_categories.map((category, index) => {
        let followSuggestions;
        if (index === category_index) {
          followSuggestions = category.follow_suggestions.map((follow_suggestion, index) => {
            if (index === follow_index) {
              return {
                ...follow_suggestion,
                loading: true
              };
            }
            return follow_suggestion;
          });
          return {
            ...category,
            follow_suggestions: followSuggestions
          };
        }
        return category;
      })
    })
  }

  async afterClickFollow(item, follow_index, category_index) {
    await this.setState({
      home_categories: this.state.home_categories.map((category, index) => {
        let followSuggestions;
        if (index === category_index) {
          followSuggestions = category.follow_suggestions.map((follow_suggestion, index) => {
            if (index === follow_index) {
              return {
                ...follow_suggestion,
                loading: false
              };
            }
            return follow_suggestion;
          });
          return {
            ...category,
            follow_suggestions: followSuggestions
          };
        }
        return category;
      })
    })
  }

  async onSuccessFollow(res, follow_index, category_index) {
    const new_following = res.data;
    await this.setState({
      home_categories: this.state.home_categories.map((category, index) => {
        let followSuggestions;
        if (index === category_index) {
          followSuggestions = category.follow_suggestions.map((follow_suggestion, index) => {
            if (index === follow_index) {
              return {
                ...follow_suggestion,
                following: new_following
              };
            }
            return follow_suggestion;
          });
          return {
            ...category,
            follow_suggestions: followSuggestions
          };
        }
        return category;
      })
    })
  }

  renderCategory() {
    return this.state.home_categories.map((category_chunk, category_index) => {
      const navigation = this.props.navigation;
      const { rowWrapper } = BaseStyle;
      const { category, klass, category_korean , follow_suggestions, five_story, popular_fives } = category_chunk;

      return (
        <Grid key={category}>
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
                id={five_story.id}
                title={five_story.title}
                subtitle={five_story.subtitle}
                image_url={five_story.image_large_url}
                onPress={() => navigation.navigate('FiveStoryShow', {
                  title: five_story.title,
                  id: five_story.id,
                  five_story: five_story,
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
            title={`팔로우 제안`}
            sub={`다른 사람의 ${category_korean} 파이브를 둘러보세요.`}
          />
          <Row style={{ backgroundColor: '#fafafa' }}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={follow_suggestions}
              style={rowWrapper}
              removeClippedSubviews={true}
              renderItem={({ item, index }) => (
                <UserFivesBar
                  onPress={() => navigation.navigate('UserShow', {
                    user: item.user,
                  })}
                  defaultImage={require('../../assets/images/five_void_grey.png')}
                  onPressFollow={() => this.toggleFollowCall(item, index, category_index)}
                  category={category}
                  fives={item.fives}
                  limit={item.fives.length < 3}
                  clicked={item.following}
                  loading={item.loading}
                  user={item.user}
                />
              )}
              keyExtractor={item => 'user-fives-' + category + item.user.id}
            />
          </Row>
          <RowHeaderBar
            title={`이런 ${category_korean}은 어떠세요?`}
            sub={`지금 누군가의 FIVE로 선택된 ${category_korean}입니다.`}
          />
          <Row>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={popular_fives}
              style={rowWrapper}
              removeClippedSubviews={true}
              renderItem={({ item }) => (
                <FiveUnitRound
                  category={category}
                  id={item.five.id}
                  title={item.five.title}
                  subtitle={item.five.subtitle}
                  five_users_count={item.five.five_users_count}
                  image_url={item.five.image_medium_url}
                  onPress={() => navigation.navigate('FiveShow', {
                    category: category,
                    title: item.five.title,
                    id: item.five.id,
                  })}
                  borderRadius={8}
                  marginRight={24}
                />
              )}
              keyExtractor={item => `popular-${item.five.klass}-fives-` + item.five.id}
            />
          </Row>
        </Grid>
      );
    });
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
          {this.renderCategory()}
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