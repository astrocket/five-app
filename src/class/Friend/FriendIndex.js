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
import {
  UserUnitBar
} from '../../component/common';
import axios from 'axios';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import ApplicationStore from '../../mobx/ApplicationStore';

export default class FriendIndex extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: '신규 가입 친구들',
    ...Constant.FiveNavOptions,
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: false, //실서비스에서는 로딩 true로
      followers: [
        {
          id: '1',
          name: '혜리',
          image_url: 'https://pbs.twimg.com/profile_images/434151642951213056/h-YeBKj8.jpeg',
          restaurant_following: true
        }, {
          id: '2',
          name: '김유정',
          image_url: 'https://pbs.twimg.com/profile_images/846361396296241152/zK7wpe1o.jpg',
          restaurant_following: false
        }, {
          id: '3',
          name: '설현',
          image_url: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/160911_%EB%8F%99%ED%83%84_%EC%97%94%ED%84%B0%EC%8B%9D%EC%8A%A4_%EC%84%A4%ED%98%84_%ED%8C%AC%EC%8B%B8%EC%9D%B8%ED%9A%8C.jpg',
          restaurant_following: true
        }, {
          id: '4',
          name: 'Taylor Swift',
          image_url: 'https://www.grammy.com/sites/com/files/styles/image_landscape_hero/public/taylorswift-hero-510837066.jpg?itok=VeBknRmv',
          restaurant_following: false
        }, {
          id: '5',
          name: 'Leo',
          image_url: 'https://cdn1.thr.com/sites/default/files/imagecache/landscape_928x523/2014/11/leonardo_dicaprio.jpg',
          restaurant_following: true
        }, {
          id: '6',
          name: '혜리',
          image_url: 'https://pbs.twimg.com/profile_images/434151642951213056/h-YeBKj8.jpeg',
          restaurant_following: true
        }, {
          id: '7',
          name: '김유정',
          image_url: 'https://pbs.twimg.com/profile_images/846361396296241152/zK7wpe1o.jpg',
          restaurant_following: true
        }, {
          id: '8',
          name: '설현',
          image_url: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/160911_%EB%8F%99%ED%83%84_%EC%97%94%ED%84%B0%EC%8B%9D%EC%8A%A4_%EC%84%A4%ED%98%84_%ED%8C%AC%EC%8B%B8%EC%9D%B8%ED%9A%8C.jpg',
          restaurant_following: false
        }, {
          id: '9',
          name: 'Taylor Swift',
          image_url: 'https://www.grammy.com/sites/com/files/styles/image_landscape_hero/public/taylorswift-hero-510837066.jpg?itok=VeBknRmv',
          restaurant_following: true
        }, {
          id: '10',
          name: 'Leo',
          image_url: 'https://cdn1.thr.com/sites/default/files/imagecache/landscape_928x523/2014/11/leonardo_dicaprio.jpg',
          restaurant_following: true
        },
      ],
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
    axios.get(ApiServer.HOME_INDEX, config)
      .then((response) => {
        console.log(response);
        this.setState({
          loading: false,
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
            data={this.state.followers}
            renderItem={({ item }) => (
              <UserUnitBar
                id={item.id}
                name={item.name}
                image_url={item.image_url}
                onPress={() => navigation.navigate('UserShow', {
                  user: item,
                  title: item.name,
                })}
              />
            )}
            keyExtractor={item => 'friend-list-' + item.id}
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
