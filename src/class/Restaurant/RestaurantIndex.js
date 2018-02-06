import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {
  Container, Header, Content, Text, Spinner, Icon, Button, H1,
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import {
  RowHeaderBar, MainLargeTitle, FiveUnitRound, UserUnitRound, FiveStoryFull, UserFivesBar
} from '../../component/common';
import RestaurantShow from './RestaurantModal';
import axios from 'axios';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('ApplicationStore') // Inject some or all the stores!
@observer
export default class RestaurantIndex extends Component {

  static navigationOptions = ({ navigation }) => ({
    headerRight: (
      <Button onPress={() => navigation.navigate('Invitation')} transparent>
        <Icon
          name="md-person-add"
          style={{
            fontSize: 25,
            color: Constant.FiveColor,
          }}
        />
      </Button>
    ),
    ...Constant.FiveNavOptions,
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: true, //실서비스에서는 로딩 true로
      restaurants: [],
      users: [],
      five_stories: [],
      challenge_restaurants: [],
      follow_suggestions: [],
    };
  }

  componentDidMount() {
    this.apiCall();
  }

  apiCall() {
    const config = {
      headers: {
        'X-User-Email': this.props.ApplicationStore.email,
        'X-User-Token': this.props.ApplicationStore.token,
      },
    };
    axios.get(ApiServer.RESTAURANTS, config)
      .then((response) => {
        this.setState({
          loading: false,
          restaurants: response.data.restaurants,
          users: response.data.users,
          five_stories: response.data.five_stories,
          challenge_restaurants: response.data.challenge_restaurants,
          follow_suggestions: response.data.follow_suggestions,
        })
      })
      .catch((error) => {
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
    const stateBefore = [...this.state.follow_suggestions];
    stateBefore[index].following = new_following;
    this.setState({ follow_suggestions: stateBefore });
  }

  render() {
    const { container, preLoading, rowWrapper } = BaseStyle;
    const { navigation } = this.props;

    return (
      <Container>
        <Content>
          <Grid>
            <MainLargeTitle
              title={'맛집'}
              rightImage={'restaurant'}
            />
            <RowHeaderBar
              title={'새로 친구들의 five로 선정 된 맛집'}
              onPress={() => navigation.navigate('RestaurantList', {
                restaurants: this.state.restaurants,
              })}
              moreTitle={'더보기'}
            />
            <Row>
              <FlatList
                horizontal
                data={this.state.restaurants}
                style={rowWrapper}
                renderItem={({ item }) => (
                  <FiveUnitRound
                    id={item.id}
                    subtitle={item.location}
                    title={item.title}
                    five_users_count={item.five_users_count}
                    image_url={item.image_medium_url}
                    onPress={() => navigation.navigate('RestaurantShow', { title: item.title, id: item.id, navLoading: true })}
                    barWidth={150}
                    barHeight={150}
                    borderRadius={15}
                    marginRight={10}
                  />
                )}
                keyExtractor={item => 'restaurant-' + item.id}
              />
            </Row>
            <RowHeaderBar
              title={'새로 five 를 바꾼 친구'}
              onPress={() => navigation.navigate('UserList', {
                users: this.state.users,
                category: 'restaurant',
              })}
              moreTitle={'더보기'}
            />
            <Row>
              <FlatList
                horizontal
                data={this.state.users}
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
                keyExtractor={item => 'user-' + item.id}
              />
            </Row>
            <RowHeaderBar
              title={'FIVE 스토리'}
            />
            <Row>
              <FlatList
                horizontal
                data={this.state.five_stories}
                style={rowWrapper}
                renderItem={({ item }) => (
                  <FiveStoryFull
                    multiple
                    id={item.id}
                    title={item.title}
                    subtitle={item.subtitle}
                    image_url={item.image_large_url}
                    onPress={() => navigation.navigate('FiveStoryShow', {
                      title: item.title,
                      id: item.id,
                      five_story: item,
                    })}
                    barWidth={null}
                    barHeight={null}
                    borderRadius={15}
                    marginRight={10}
                  />
                )}
                keyExtractor={item => 'five-stories-' + item.id}
              />
            </Row>
            <RowHeaderBar
              title={'당신의 FIVE에 도전합니다'}
            />
            <Row>
              <FlatList
                horizontal
                data={this.state.challenge_restaurants}
                style={rowWrapper}
                renderItem={({ item }) => (
                  <FiveUnitRound
                    id={item.id}
                    subtitle={item.location}
                    title={item.title}
                    five_users_count={item.five_users_count}
                    image_url={item.image_medium_url}
                    onPress={() => navigation.navigate('RestaurantShow', { title: item.title, id: item.id, navLoading: true })}
                    barWidth={150}
                    barHeight={150}
                    borderRadius={15}
                    marginRight={10}
                  />
                )}
                keyExtractor={item => 'restaurant-challenge-' + item.id}
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
                    onPress={() => navigation.navigate('UserFiveShow', { user: item.user ,category_data: item, five_category: item.klass.toLowerCase(), navLoading: true })}
                    onPressFollow={() => this.followCall(item, index)}
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
