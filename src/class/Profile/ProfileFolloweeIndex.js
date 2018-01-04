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
import { FollowUnitBar } from '../../component/common';
import axios from 'axios';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('ApplicationStore') // Inject some or all the stores!
@observer
export default class ProfileFolloweeIndex extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: '내 팔로잉',
    ...Constant.FiveNavOptions,
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: false, //실서비스에서는 로딩 true로
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
    axios.get(`${ApiServer.MY_PROFILE}/followees?category=${this.props.navigation.state.params.five_category}`, config)
      .then((response) => {
        console.log(response);
        this.setState({
          loading: false,
          followees_followings: response.data.followees_followings,
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
