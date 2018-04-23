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
import {
  UserUnitBar, EmptyBox, ShowMore, NavBar
} from '../../component/common';
import * as Constant from '../../config/Constant';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('stores') @observer
export default class UserFolloweeIndex extends Component {

  static navigationOptions = ({ navigation }) => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.app = this.props.stores.app;
    this.server = this.props.stores.server;
    this.state = {
      loading: true,
      refreshing: false,
      page: 1,
      page_loading: false,
      no_more: false,
      user: this.props.navigation.state.params.user,
      category: this.props.navigation.state.params.category,
      followees: [],
    };
  }

  componentDidMount() {
    this.server.userFollowees(this.state.user.id, this.state.category, this.state.page, (res) => {
      this.setState({
        followees: res.data.followees, no_more: res.data.no_more
      });
    }).then(() => this.setState({ loading: false }));
  }

  _onRefresh() {
    this.setState({ refreshing: true, page: 1 }, () => {
      this.server.userFollowees(this.state.user.id, this.state.category, this.state.page, (res) => {
        this.setState({
          followees: res.data.followees, no_more: res.data.no_more
        });
      }).then(() => this.setState({ refreshing: false }));
    });
  }

  nextPage() {
    this.setState({ page: this.state.page + 1, page_loading: true, }, () => {
      this.server.userFollowees(this.state.user.id, this.state.category, this.state.page, (res) => {
        this.setState({
          followees: [ ...this.state.followees, ...res.data.followees ], no_more: res.data.no_more
        });
      }).then(() => this.setState({ page_loading: false }));
    });
  }

  render() {
    const { container, preLoading } = BaseStyle;
    const { navigation } = this.props;

    return (
      <Container style={{ backgroundColor: 'white' }}>
       <NavBar
          leftButton
          leftAsImage
          leftIcon={require('../../assets/images/back_icon_pink.png')}
          onPressLeft={() => navigation.goBack()}
          headerText={`팔로잉`}
        />
        <Content refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }>
          {this.state.followees.length > 0 ?
            <FlatList
              data={this.state.followees}
              renderItem={({ item }) => (
                <UserUnitBar
                  user={item}
                  onPress={() => this.props.navigation.navigate('UserShow', {
                    user: item,
                    title: item.name,
                  })}
                />
              )}
              keyExtractor={item => 'user-followees-list-' + item.id}
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
          :<EmptyBox
              barWidth={Constant.deviceWidth - 20}
              message={`아직 ${this.state.user.name}님이 팔로우 하는 친구가 없어요.`}
              barHeight={100}
              borderRadius={10}
              marginRight={0}
            />}
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
