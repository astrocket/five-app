import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import {
  Container, Header, Content, Text, Spinner, Icon, Button, H1,
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import {
  FiveUnitRound, UserUnitRound, FiveStoryFull, UserFivesBar
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
    title: '#맛집',
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

  render() {
    const { container, preLoading } = BaseStyle;
    const { navigation } = this.props;

    return (
      <Container>
        <Content>
          <Grid style={{ marginBottom: 20 }}>
            <View style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: 10,
              paddingBottom: 10,
              paddingLeft: 10,
              paddingRight: 10,
            }}>
              <Text small>새로 친구들의 five로 선정 된 맛집</Text>
              <TouchableOpacity onPress={() => navigation.navigate('RestaurantList', {
                restaurants: this.state.restaurants,
              })} underlayColor={'#fff'}>
                <Text primary>더보기</Text>
              </TouchableOpacity>
            </View>
            <Row style={{ marginBottom: 20 }}>
              <FlatList
                horizontal
                data={this.state.restaurants}
                style={{
                  paddingLeft: 10,
                  paddingRight: 10,
                }}
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
            <View style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: 10,
              paddingBottom: 10,
              paddingLeft: 10,
              paddingRight: 10,
            }}>
              <Text small>새로 five 를 바꾼 친구</Text>
              <TouchableOpacity onPress={() => navigation.navigate('UserList', {
                users: this.state.users,
                category: 'restaurant',
              })} underlayColor={'#fff'}>
                <Text primary>더보기</Text>
              </TouchableOpacity>
            </View>
            <Row style={{ marginBottom: 20 }}>
              <FlatList
                horizontal
                data={this.state.users}
                style={{
                  paddingLeft: 10,
                  paddingRight: 20,
                }}
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
            <View style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              paddingTop: 10,
              paddingLeft: 10,
            }}>
              <Text small>FIVE 스토리</Text>
            </View>
            <Row style={{ marginBottom: 20 }}>
              <FlatList
                horizontal
                data={this.state.five_stories}
                style={{
                  paddingRight: 20,
                }}
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
                    marginRight={0}
                  />
                )}
                keyExtractor={item => 'five-stories-' + item.id}
              />
            </Row>
            <View style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              paddingTop: 10,
              paddingBottom: 10,
              paddingLeft: 10,
              paddingRight: 10,
            }}>
              <Text small>당신의 FIVE에 도전합니다</Text>
            </View>
            <Row style={{ marginBottom: 20 }}>
              <FlatList
                horizontal
                data={this.state.challenge_restaurants}
                style={{
                  paddingLeft: 10,
                  paddingRight: 10,
                }}
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
            <View style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              paddingTop: 10,
              paddingBottom: 10,
              paddingLeft: 10,
            }}>
              <Text small>팔로우 추천</Text>
            </View>
            <Row style={{ marginBottom: 20 }}>
              <FlatList
                horizontal
                data={this.state.follow_suggestions}
                style={{
                  paddingRight: 20,
                }}
                renderItem={({ item }) => (
                  <UserFivesBar
                    onPress={() => navigation.navigate('UserFiveShow', { user: item.user ,category_data: item, five_category: item.klass.toLowerCase(), navLoading: true })}
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
