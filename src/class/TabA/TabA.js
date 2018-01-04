import React, { Component } from 'react';
import {
  View,
  FlatList,
} from 'react-native';
import {
  Container, Content, Spinner, Text, Button, Icon, List, ListItem, Thumbnail, Body,
} from 'native-base';
import {
  Col,
  Row,
  Grid,
} from 'react-native-easy-grid';
import axios from 'axios';
import * as Constant from '../../config/Constant';
import { HomeCategoryBar } from '../../component/common';
import * as ApiServer from '../../config/ApiServer';
import * as Images from '../../assets/images/Images'
import BaseStyle from '../../config/BaseStyle';
import ApplicationStore from '../../mobx/ApplicationStore';

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
    title: 'MyFive',
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
    axios.get(`${ApiServer.HOME_INDEX}?category=restaurant`, config)
      .then((response) => {
        this.setState({
          loading: false,
          categories: response.data.categories
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
          <FlatList
            data={this.state.categories}
            style={{paddingBottom: 15}}
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
              onPress={console.log('hi')}
              image={Images.music_main}
              title={'음악 더미데이터'}
              people={'11932'}
              new_people={'2'}
            />
            <HomeCategoryBar
              onPress={console.log('hi')}
              image={Images.book_main}
              title={'책 더미데이터'}
              people={'8360'}
              new_people={'7'}
            />
          </List>
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
