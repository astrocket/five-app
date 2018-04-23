import React, { Component } from 'react';
import {
  View,
  FlatList, RefreshControl
} from 'react-native';
import {
  Container, Header, Content, Text, Spinner,
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import { UserUnitBar, ShowMore } from '../../component/common';
import * as Constant from '../../config/Constant';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';
// 지금 안쓰이는 부분인데, 더보기 눌러서 어디서든 일반 유저리스트 쭉 뿌리면 필요한 거임. FiveUser리스트는 Five의 유저만
@inject('stores') @observer
export default class UserList extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.title,
    ...Constant.FiveNavOptions,
  });

  constructor(props) {
    super(props);
    this.app = this.props.stores.app;
    this.server = this.props.stores.server;
    this.state = {
      loading: true,
      refreshing: false,
      users: [],
      page: 1,
      page_loading: false,
      no_more: false,
      search_params: this.props.navigation.state.params.search_params ? this.props.navigation.state.params.search_params : '',
    };
  }

  componentDidMount() {
    this.server.userList(this.state.page, this.state.search_params, (res) => {
      this.setState({
        users: res.data.users, no_more: res.data.no_more
      });
    }).then(() => this.setState({ loading: false }));
  }

  _onRefresh() {
    this.setState({ refreshing: true, page: 1 }, () => {
      this.server.userList(this.state.page, this.state.search_params, (res) => {
        this.setState({
          users: res.data.users, no_more: res.data.no_more
        });
      }).then(() => this.setState({ refreshing: false }));
    });
  }

  nextPage() {
    this.setState({ page: this.state.page + 1, page_loading: true, }, () => {
      this.server.userList(this.state.page, this.state.search_params, (res) => {
        if (res.data.no_more) {
          this.setState({ no_more: true });
        }
        this.setState({
          users: [ ...this.state.users, ...res.data.users ], no_more: res.data.no_more
        });
      }).then(() => this.setState({ page_loading: false }));
    });
  }

  render() {
    const { container, preLoading } = BaseStyle;
    const { navigation } = this.props;

    return (
      <Container>
        <Content refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }>
          <FlatList
            data={this.state.users}
            style={{
              paddingTop: 10,
            }}
            renderItem={({ item }) => (
              <UserUnitBar
                user={item}
                onPress={() => this.props.navigation.navigate('UserShow', {
                  user: item,
                  title: item.name,
                })}
              />
            )}
            keyExtractor={item => 'user-list-' + item.id}
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
          <Spinner size="large" />
        </View>
        }
      </Container>
    );
  }
}
