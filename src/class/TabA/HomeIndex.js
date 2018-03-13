import React, { Component } from 'react';
import {
  View, FlatList, RefreshControl,
} from 'react-native';
import {
  Container, Content, Spinner, Text, Button, Icon, List, ListItem, Thumbnail, Body,
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import axios from 'axios';
import * as Constant from '../../config/Constant';
import {
  RowHeaderBar, MainLargeTitle, HomeCategoryBar, FiveStoryFull, FiveUnitRound, UserFivesBar,
} from '../../component/common';
import * as ApiServer from '../../config/ApiServer';
import * as Images from '../../assets/images/Images';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('ApplicationStore') // Inject some or all the stores!
@observer
export default class HomeIndex extends Component {

  static navigationOptions = ({ navigation }) => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: true, //실서비스에서는 로딩 true로
      categories: [],
      five_story: [],
      popular_fives: [],
      follow_suggestions: [],
      refreshing: false,
    };
  }

/*  componentWillMount() {
    this.props.navigation.setParams({
      openDrawerAction: () => this.openDrawerAction(),
    });
  }*/

  componentDidMount() {
    this.apiCall();
  }

  async apiCall() {
    const config = {
      headers: {
        'X-User-Email': this.props.ApplicationStore.email,
        'X-User-Token': this.props.ApplicationStore.token,
      },
    };
    await axios.get(`${ApiServer.HOME_INDEX}?category=restaurant`, config)
      .then((response) => {
        this.setState({
          loading: false,
          categories: response.data.categories,
          five_story: response.data.five_story,
          popular_fives: response.data.popular_fives,
          follow_suggestions: response.data.follow_suggestions,
        });
      })
      .catch((error) => {
        console.log(error.response);
      });
  }

/*  openDrawerAction() {
    this.props.screenProps.modalNavigation.navigate('DrawerOpen');
  }*/

  followCall(item, index) {
    const data = {
      following: {
        user_id: item.user.id,
        following: !item.following,
      },
    };

    const header = {
      headers: {
        'X-User-Email': this.props.ApplicationStore.email,
        'X-User-Token': this.props.ApplicationStore.token,
      },
    };

    axios.post(`${ApiServer.FOLLOWINGS}/?category=${item.klass.toLowerCase()}`, data, header)
      .then((response) => {
        this.onCreateFollowCallSuccess(response, index); // 업로드 후 유저를 통째로 리턴시킨다.
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
    const stateBefore = [ ...this.state.follow_suggestions ];
    stateBefore[ index ].following = new_following;
    this.setState({ follow_suggestions: stateBefore });
  }

  _onRefresh() {
    this.setState({ refreshing: true });
    this.apiCall().then(() => {
      this.setState({ refreshing: false });
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
          />
        }>
          <Grid>
            <RowHeaderBar
              title={'FIVE 스토리'}
            />
            <Row>
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
                borderRadius={15}
                marginRight={10}
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
                    onPress={() => navigation.navigate('UserFiveShow', {
                      user: item.user,
                      category_data: item,
                      five_category: item.klass.toLowerCase(),
                      navLoading: true,
                    })}
                    defaultImage={Images.findImageOf(item.category)}
                    onPressFollow={() => this.followCall(item, index)}
                    category={item.category}
                    followers={item.followers_count}
                    followees={item.followees_count}
                    fives={item.fives}
                    clicked={item.following}
                    user={item.user}
                  />
                )}
                keyExtractor={item => 'user-fives-' + item.id}
              />
            </Row>
            <RowHeaderBar
              title={'요즘 뜨는 아이템'}
            />
            <Row>
              <FlatList
                horizontal
                data={this.state.popular_fives}
                style={rowWrapper}
                renderItem={({ item }) => (
                  <FiveUnitRound
                    id={item.five.id}
                    title={item.five.title}
                    subtitle={item.five.subtitle}
                    five_users_count={item.five.five_users_count}
                    image_url={item.five.image_medium_url}
                    onPress={() => navigation.navigate(`${item.klass}Show`, {
                      title: item.five.title,
                      id: item.five.id,
                      navLoading: true,
                    })}
                    barWidth={150}
                    barHeight={150}
                    borderRadius={15}
                    marginRight={10}
                  />
                )}
                keyExtractor={item => `popular-${item.five.klass}-fives-` + item.five.id}
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
