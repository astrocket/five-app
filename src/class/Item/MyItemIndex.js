import React, { Component } from 'react';
import {
  View, FlatList,
} from 'react-native';
import {
  Container, Header, Content, Text, Spinner,
  Item, Input, Icon, Button,
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import { MyItemUnitBar, ShowMore } from '../../component/common';
import RestaurantShow from '../Restaurant/RestaurantModal';
import axios from 'axios';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import ApplicationStore from '../../mobx/ApplicationStore';

export default class MyItemIndex extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: '내 팔로워',
    ...Constant.FiveNavOptions,
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: false, //실서비스에서는 로딩 true로
      restaurant_wishes: [],
      page: 1,
      page_loading: false,
      no_more: false,
    };
  }

  componentDidMount() {
    this.apiCall();
  }

  apiCall() {
    const config = {
      headers: {
        'X-User-Email': ApplicationStore.email,
        'X-User-Token': ApplicationStore.token,
      },
    };
    axios.get(`${ApiServer.MY_PROFILE}/wishes?category=restaurant&page=${this.state.page}`, config)
      .then((response) => {
        console.log(response);
        this.setState({
          loading: false,
          restaurant_wishes: response.data
        });
      })
      .catch((error) => {
        console.log(error.response);
      });
  }

  pageCall() {
    const config = {
      headers: {
        'X-User-Email': ApplicationStore.email,
        'X-User-Token': ApplicationStore.token,
      },
    };
    axios.get(`${ApiServer.MY_PROFILE}/wishes?category=restaurant&page=${this.state.page}`, config)
      .then((response) => {
        console.log(response);
        if (response.data === undefined || response.data.length === 0) {
          this.setState({ no_more: true });
        }
        this.setState({
          restaurant_wishes: [ ...this.state.restaurant_wishes, ...response.data ],
          page_loading: false,
        });
      }).catch((error) => {
      console.log(error.response);
    });
  }

  nextPage() {
    this.setState({
      page: this.state.page + 1,
      page_loading: true,
    }, () => {
      this.pageCall();
    });
  }

  render() {
    const { container, preLoading } = BaseStyle;
    const { navigation } = this.props;

    return (
      <Container>
        <Header searchBar noShadow rounded style={{
          paddingTop: 0,
          height: 56,
        }}>
          <Item>
            <Icon name="ios-search"/>
            <Input
              placeholder="Search"
              autoCapitalize={'none'}
              autoCorrect={false}
            />
            <Icon name="ios-people"/>
          </Item>
          <Button transparent>
            <Text>검색</Text>
          </Button>
        </Header>
        <Content>
          <FlatList
            data={this.state.restaurant_wishes}
            renderItem={({ item }) => (
              <MyItemUnitBar
                id={item.id}
                title={item.title}
                onPress={() => navigation.navigate('RestaurantShow', { title: item.title, id: item.id, navLoading: true })}
                location={item.location}
                image_url={item.image_url}
                date_time={item.date_time}
              />
            )}
            keyExtractor={item => 'my-restaurant-list-' + item.id}
            ListFooterComponent={
              () =>
                <ShowMore
                  onPress={() => this.nextPage()}
                  moreText={'더보기'}
                  overText={'끝'}
                  no_more={this.state.no_more}
                  page_loading={this.state.page_loading}
                />
            }
          />
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
