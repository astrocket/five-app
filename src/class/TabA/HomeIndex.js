import React, { Component } from 'react';
import {
  StyleSheet, View, FlatList, RefreshControl, Alert,
} from 'react-native';
import {
  Container, Content, Spinner, Toast
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import axios from 'axios';
import * as Constant from '../../config/Constant';
import {
  RowHeaderBar, FiveStoryFull, FiveUnitRound, UserFivesBar,
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
      five_story: [],
      popular_fives: [],
      follow_suggestions: [],
      refreshing: false,
    };
  }

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
    await axios.get(`${ApiServer.HOME_INDEX}`, config)
      .then((response) => {
        this.setState({
          loading: false,
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

  askFollowOption(item, index) {
    console.log(JSON.stringify(this.props.ApplicationStore.categories));
    this.props.ApplicationStore.hasCategory(item.category).then((have) => {
      if (have) {
        this.followCall(item, index);
      } else {
        Alert.alert(
          `아직 시작한 주제가 아니에요`,
          `${item.category_korean} 파이브를 시작하고 ${item.user.name}님을 팔로우 하시겠어요?`,
          [
            {
              text: '네',
              onPress: () => this.followCall(item, index).then(() => {
                this.props.navigation.navigate(`SearchFive`, {
                  category: item.category,
                  category_korean: item.category_korean,
                  klass: item.klass,
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

  async followCall(item, index) {
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

    await axios.post(`${ApiServer.FOLLOWINGS}/?category=${item.category}`, data, header)
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
                borderRadius: 24
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
                    onPressFollow={() => this.askFollowOption(item, index)}
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
              style={{ height: 32, backgroundColor: '#fafafa' }}
            /> 
            <Row style={{
              padding: 16,
              backgroundColor: '#fafafa',
              }}>
              <Row style={{
                padding: 0,
                backgroundColor: 'white',
                borderRadius: 24
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
                    onPressFollow={() => this.askFollowOption(item, index)}
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
              style={{ height: 32, backgroundColor: '#fafafa' }}
            /> 
            <Row style={{
              padding: 16,
              backgroundColor: '#fafafa',
              }}>
              <Row style={{
                padding: 0,
                backgroundColor: 'white',
                borderRadius: 24
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
                    onPressFollow={() => this.askFollowOption(item, index)}
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
          <Spinner size='large' color={Constant.FiveColor} />
        </View>
        }
      </Container>
    );
  }
}