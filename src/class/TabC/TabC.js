import React, { Component } from 'react';
import {
  View, TouchableOpacity, AsyncStorage, FlatList, Alert, Keyboard,
} from 'react-native';
import {
  Container, Header, Content, Text, Spinner,
  Item, Input, Icon, Button, Toast,
} from 'native-base';
import {
  Col,
  Row,
  Grid,
} from 'react-native-easy-grid';
import { FiveUnitBar, ShowMore } from '../../component/common';
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
    title: '검색',
    ...Constant.FiveNavOptions,
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      searched: false,
    };
  }


  apiCall() {
    const config = {
      headers: {
        'X-User-Email': this.props.ApplicationStore.email,
        'X-User-Token': this.props.ApplicationStore.token,
      },
    };
    axios.get(ApiServer.HOME_INDEX, config)
      .then((response) => {
        this.setState({
          loading: false,
        });
      })
      .catch((error) => {
        console.log(error.response);
      });
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

  renderSearchResult() {
    if (this.state.searched) {
      return (
        <Content>
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
                        <Text small>맛집</Text>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('RestaurantList', {
                          restaurants: this.state.restaurants,
                          search_params: this.state.input_search
                        })} underlayColor={'#fff'}>
                          <Text primary>더보기</Text>
                        </TouchableOpacity>
                      </View>
                    )
                  } else {
                    return (
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
                        <Text small>맛집이 없습니다.</Text>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('RestaurantList', {
                          restaurants: this.state.restaurants,
                        })} underlayColor={'#fff'}>
                          <Text primary>전체보기</Text>
                        </TouchableOpacity>
                      </View>
                    )
                  }
                }
                }
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
              <Text small>음악</Text>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('RestaurantSearchList', {
                  restaurants: this.state.restaurants,
                })} underlayColor={'#fff'}>
                <Text primary>더보기</Text>
              </TouchableOpacity>
            </View>
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
              <Text small>책</Text>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('RestaurantSearchList', {
                  restaurants: this.state.restaurants,
                })} underlayColor={'#fff'}>
                <Text primary>더보기</Text>
              </TouchableOpacity>
            </View>
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
