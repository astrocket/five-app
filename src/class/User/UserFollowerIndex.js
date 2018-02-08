import React, { Component } from 'react';
import {
  View, FlatList, RefreshControl
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
export default class UserFollowerIndex extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: '팔로워',
    ...Constant.FiveNavOptions,
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: false, //실서비스에서는 로딩 true로
      refreshing: false,
      followers: [],
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
    await axios.get(`${ApiServer.USERS}/${this.props.navigation.state.params.user.id}/followers?category=${this.props.navigation.state.params.five_category}`, config)
      .then((response) => {
        console.log(response);
        this.setState({
          loading: false,
          followers: response.data,
        });
      })
      .catch((error) => {
        console.log(error.response);
      });
  }

  _onRefresh() {
    this.setState({refreshing: true});
    this.apiCall().then(() => {
      this.setState({refreshing: false});
    });
  }

  render() {
    const { container, preLoading } = BaseStyle;
    const { navigation } = this.props;

    return (
      <Container>
{/*        <Header searchBar noShadow rounded style={{paddingTop: 0, height: 56 }}>
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
        </Header>*/}
        <Content refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }>
          <FlatList
            data={this.state.followers}
            renderItem={({ item }) => (
              <FollowUnitBar
                user={item}
                onPress={() => navigation.navigate('UserShow', {
                  user: item,
                  title: item.name,
                })}
              />
            )}
            keyExtractor={item => 'user-followers-list-' + item.id}
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
