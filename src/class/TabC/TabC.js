import React, { Component } from 'react';
import {
  View, TouchableOpacity, AsyncStorage, FlatList, Alert, Keyboard,
} from 'react-native';
import {
  Container, Header, Content, Text, Spinner,
  Item, Input, Icon, Button, Toast, Left, Body, Title, Right,
} from 'native-base';
import {
  Col,
  Row,
  Grid,
} from 'react-native-easy-grid';
import { FiveUnitBar, ElevenHeader, RowHeaderBar } from '../../component/common';
import axios from 'axios';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('ApplicationStore') // Inject some or all the stores!
@observer
export default class TabC extends Component {

  static navigationOptions = ({ navigation }) => ({
    tabBarLabel: '검색',
    tabBarIcon: ({ tintColor }) => (
      <Icon
        name="ios-search-outline"
        style={{
          fontSize: 25,
          color: tintColor,
        }}
      />
    ),
    header: null,
    ...Constant.FiveNavOptions,
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      searched: false,
      headerShow: true,
      restaurants: [],
      musics: [],
    };
  }

  searchApi(input_search) {
    this.setState({ loading: true });
    const config = {
      headers: {
        'X-User-Email': this.props.ApplicationStore.email,
        'X-User-Token': this.props.ApplicationStore.token,
      },
    };
    axios.get(`${ApiServer.HOME}/search?s=${input_search}`, config)
      .then((response) => {
        console.log(response);
        this.setState({
          loading: false,
          searched: true,
          restaurants: response.data.restaurants,
          musics: response.data.musics,
          page_loading: false,
        });
      })
      .catch((error) => {
        console.log(error.response);
      });
  }

  handleInputSearch(input_search) {
    if (input_search === '') {
      this.setState({ searched: false });
    } else {
      this.setState({ input_search });
    }
  }

  handleScroll(e) {
    var currentOffset = e.nativeEvent.contentOffset.y;
    var headerShow = currentOffset < 100;
    this.setState({ headerShow });
  }

  renderSearchResult() {
    if (this.state.searched) {
      return (
        <Content onScroll={(e) => this.handleScroll(e)}>
          <Grid>
            <Row style={{ marginBottom: 20 }}>
              <FlatList
                data={this.state.restaurants}
                renderItem={({ item, index }) => (
                  <FiveUnitBar
                    multiple
                    id={item.id}
                    title={item.title}
                    location={item.location}
                    friends_info={item.friends_info}
                    image_url={item.image_medium_url}
                    icon={'ios-arrow-forward-outline'}
                    onPress={() => this.props.navigation.navigate(`${item.klass}Show`, {
                      title: item.title,
                      id: item.id,
                      navLoading: true,
                    })}
                  />
                )}
                keyExtractor={item => 'search-five-list-' + item.id}
                ListHeaderComponent={() => {
                  if (this.state.restaurants.length > 0) {
                    return (
                      <RowHeaderBar
                        title={'맛집'}
                        onPress={() => this.props.navigation.navigate('RestaurantList', {
                          restaurants: this.state.restaurants,
                          search_params: this.state.input_search,
                        })}
                        moreTitle={'더보기'}
                      />
                    );
                  } else {
                    return (
                      <RowHeaderBar
                        title={'맛집이 없습니다'}
                        onPress={() => this.props.navigation.navigate('RestaurantList', {
                          restaurants: this.state.restaurants,
                        })}
                        moreTitle={'전체보기'}
                      />
                    );
                  }
                }
                }
              />
            </Row>
            <Row>
              <FlatList
                data={this.state.musics}
                renderItem={({ item, index }) => (
                  <FiveUnitBar
                    multiple
                    id={item.id}
                    title={item.title}
                    location={item.location}
                    friends_info={item.friends_info}
                    image_url={item.image_medium_url}
                    icon={'ios-arrow-forward-outline'}
                    onPress={() => this.props.navigation.navigate(`${item.klass}Show`, {
                      title: item.title,
                      id: item.id,
                      navLoading: true,
                    })}
                  />
                )}
                keyExtractor={item => 'search-music-list-' + item.id}
                ListHeaderComponent={() => {
                  if (this.state.musics.length > 0) {
                    return (
                      <RowHeaderBar
                        title={'음악'}
                        onPress={() => this.props.navigation.navigate('MusicList', {
                          musics: this.state.musics,
                        })}
                        moreTitle={'더보기'}
                      />
                    );
                  } else {
                    return (
                      <RowHeaderBar
                        title={'음악이 없습니다'}
                        onPress={() => this.props.navigation.navigate('MusicList', {
                          musics: this.state.musics,
                        })}
                        moreTitle={'전체보기'}
                      />
                    );
                  }
                }
                }
              />
            </Row>
            <RowHeaderBar
              title={'책'}
              onPress={() => this.props.navigation.navigate('RestaurantSearchList', {
                restaurants: this.state.restaurants,
              })}
              moreTitle={'전체보기'}
            />
          </Grid>
        </Content>
      );
    } else {
      return (
        <View style={{
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          flexDirection: 'column',
        }}>
          <Text>성수동 맛집</Text>
          <Text>성수동 맛집</Text>
          <Text>성수동 맛집</Text>
          <Text>성수동 맛집</Text>
        </View>
      );
    }
  }

  render() {
    const { container, preLoading } = BaseStyle;
    const { navigation } = this.props;

    return (
      <Container>
        <ElevenHeader
          headerShow={this.state.headerShow}
          title={'검색'}
        >
        </ElevenHeader>
        <Header searchBar rounded style={{
          paddingTop: 0,
          height: 56,
        }}>
          <Item>
            <Icon name="ios-search"/>
            <Input
              placeholder="검색어를 입력해주세요"
              autoCapitalize={'none'}
              autoCorrect={false}
              autoFocus={false}
              multiline={false}
              returnKeyType={'search'}
              onSubmitEditing={() => this.searchApi(this.state.input_search)}
              onChangeText={(input_search) => this.handleInputSearch(input_search)}
            />
            <Icon name="ios-people"/>
          </Item>
        </Header>
        {this.renderSearchResult()}
        {this.state.loading &&
        <View style={preLoading}>
          <Spinner size="large"/>
        </View>
        }
      </Container>
    );
  }
}
