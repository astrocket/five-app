import React, { Component } from 'react';
import {
  View, FlatList, TouchableOpacity
} from 'react-native';
import {
  Container, Header, Content, Text, Spinner,
  Item, Input, Icon, Button,
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import { FollowUnitBar } from '../../component/common';
import axios from 'axios';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('ApplicationStore') // Inject some or all the stores!
@observer
export default class FollowIndex extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: '내 팔로워',
    ...Constant.FiveNavOptions,
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: true, //실서비스에서는 로딩 true로
      followers_followings: [],
      followees_followings: [],
      flip: false
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
    axios.get(`${ApiServer.MY_PROFILE}/follows`, config)
      .then((response) => {
        console.log(response);
        this.setState({
          loading: false,
          followers_followings: response.data.followers_followings,
          followees_followings: response.data.followees_followings,
        });
      })
      .catch((error) => {
        console.log(error.response);
      });
  }

  flipCard() {
    this.setState({
      flip: !this.state.flip,
    });
  }

  render() {
    const { container, preLoading } = BaseStyle;
    const { navigation } = this.props;
    if (this.state.flip) {
      return (
        <Container>
          <Header searchBar noShadow rounded style={{paddingTop: 0, height: 56 }}>
            <Item>
              <Icon name="ios-search" />
              <Input
                placeholder="Search"
                autoCapitalize={'none'}
                autoCorrect={false}
              />
              <Icon name="ios-people" />
            </Item>
            <Button transparent>
              <Text>검색</Text>
            </Button>
          </Header>
          <Content>
            <FlatList
              data={this.state.followees_followings}
              renderItem={({ item }) => (
                <FollowUnitBar
                  user={item.followee}
                  following={item}
                  onPress={() => navigation.navigate('UserShow', {
                    user: item.followee,
                    title: item.followee.name,
                  })}
                />
              )}
              keyExtractor={item => 'followees_followings-list-' + item.id}
              ListHeaderComponent={() =>
                <View style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                }}>
                  <Button transparent onPress={() => this.flipCard()} >
                    <Text note>팔로잉 보기</Text>
                  </Button>
                </View>
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
    } else {
      return (
        <Container>
          <Header searchBar noShadow rounded style={{paddingTop: 0, height: 56 }}>
            <Item>
              <Icon name="ios-search" />
              <Input
                placeholder="Search"
                autoCapitalize={'none'}
                autoCorrect={false}
              />
              <Icon name="ios-people" />
            </Item>
            <Button transparent>
              <Text>검색</Text>
            </Button>
          </Header>
          <Content>
            <FlatList
              data={this.state.followers_followings}
              renderItem={({ item }) => (
                <FollowUnitBar
                  user={item.follower}
                  following={item}
                  onPress={() => navigation.navigate('UserShow', {
                    user: item.follower,
                    title: item.follower.name,
                  })}
                />
              )}
              keyExtractor={item => 'followers_followings-list-' + item.id}
              ListHeaderComponent={() =>
                <View style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                }}>
                  <Button transparent onPress={() => this.flipCard()} >
                    <Text note>팔로워 보기</Text>
                  </Button>
                </View>
              }
            />
          </Content>
          {this.state.loading &&
          <View style={preLoading}>
            <Spinner size="large"/>
          </View>
          }
        </Container>
      )
    }

  }
}
