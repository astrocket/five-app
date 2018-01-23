import React, { Component } from 'react';
import {
  View,
  FlatList,
} from 'react-native';
import {
  Container, Content, Spinner, Text, Button, Icon, List, ListItem, Thumbnail, Body,
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import axios from 'axios';
import * as Constant from '../../config/Constant';
import { HomeCategoryBar, FiveStoryFull, FiveUnitRound, UserFivesBar } from '../../component/common';
import * as ApiServer from '../../config/ApiServer';
import * as Images from '../../assets/images/Images'
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('ApplicationStore') // Inject some or all the stores!
@observer
export default class TabA extends Component {

  static navigationOptions = ({ navigation }) => ({
    tabBarLabel: '홈',
    tabBarIcon: ({ tintColor }) => (
      <Icon
        name="ios-list-outline"
        style={{
          fontSize: 25,
          color: tintColor,
        }}
      />
    ),
    title: 'Home',
    headerRight: (
      <View style={BaseStyle.headerDoubleIconsContainer}>
        <Button onPress={() => navigation.navigate('Setting')} transparent>
          <Icon
            name="ios-settings"
            style={{
              fontSize: 25,
              color: Constant.FiveColor,
            }}
          />
        </Button>
        <Button onPress={() => navigation.navigate('DrawerOpen')} transparent>
          <Icon
            name="ios-notifications"
            style={{
              fontSize: 25,
              color: Constant.FiveColor,
            }}
          />
        </Button>
      </View>
    ),
    headerStyle: {
      backgroundColor: 'white',
    },
    headerTintColor: 'white',
    headerBackTitleStyle: {
      color: Constant.FiveColor,
    },
    headerTitleStyle: {
      color: 'black',
    },
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: true, //실서비스에서는 로딩 true로
      categories: [],
      five_stories: [],
      challenge_fives: [],
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
    axios.get(`${ApiServer.HOME_INDEX}?category=restaurant`, config)
      .then((response) => {
        this.setState({
          loading: false,
          categories: response.data.categories,
          five_stories: response.data.five_stories,
          challenge_fives: response.data.challenge_fives,
          follow_suggestions: response.data.follow_suggestions,
        });
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
          <Grid>
            <View style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
              paddingTop: 10,
              paddingLeft: 10,
            }}>
              <Button onPress={() => console.log('hi')} transparent>
                <Text primary>추가</Text>
              </Button>
            </View>
            <FlatList
              data={this.state.categories}
              renderItem={({ item }) => (
                <HomeCategoryBar
                  onPress={() => navigation.navigate('RestaurantIndex')}
                  image={Images.findImageOf(item.klass.toLowerCase())}
                  title={item.category}
                  people={item.users_count}
                  new_people={item.new_users_count}
                />
              )}
              keyExtractor={item => 'five-category-list-' + item.id}
            />
            <List>
              <HomeCategoryBar
                onPress={() => console.log('hi')}
                image={Images.music_main}
                title={'음악 더미데이터'}
                people={'11932'}
                new_people={'2'}
              />
              <HomeCategoryBar
                onPress={() => console.log('hi')}
                image={Images.book_main}
                title={'책 더미데이터'}
                people={'8360'}
                new_people={'7'}
              />
            </List>
            <View style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              paddingTop: 20,
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
                    image_url={item.image_url}
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
                keyExtractor={item => 'user-' + item.id}
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
              <Text small>당신의 FIVE에 도전합니다.</Text>
            </View>
            <Row style={{ marginBottom: 20 }}>
              <FlatList
                horizontal
                data={this.state.challenge_fives}
                style={{
                  paddingLeft: 10,
                  paddingRight: 20,
                }}
                renderItem={({ item }) => (
                  <FiveUnitRound
                    id={item.five.id}
                    title={item.five.title}
                    subtitle={item.five.subtitle}
                    five_users_count={item.five.five_users_count}
                    image_url={item.five.image_medium_url}
                    onPress={() => navigation.navigate(`${item.klass}Show`, { title: item.five.title, id: item.five.id, navLoading: true })}
                    barWidth={150}
                    barHeight={150}
                    borderRadius={15}
                    marginRight={10}
                  />
                )}
                keyExtractor={item => `challenge-${item.five.klass}-fives-` + item.five.id}
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
                  paddingLeft: 10,
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
