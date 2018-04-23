import React, { Component } from 'react';
import {
  View,
  FlatList, RefreshControl,
} from 'react-native';
import {
  Container, Header, Content, Text, Spinner,
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import { UserUnitBar, ShowMore, NavBar, } from '../../component/common';
import * as Constant from '../../config/Constant';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('stores') @observer
export default class FiveUserList extends Component {

  static navigationOptions = ({ navigation }) => ({
    header: null
  });

  constructor(props) {
    super(props);
    this.app = this.props.stores.app;
    this.server = this.props.stores.server;
    this.five = this.props.stores.five;
    this.state = {
      category: this.props.navigation.state.params.category,
      favorable_id: this.props.navigation.state.params.favorable_id,
      loading: true, //실서비스에서는 로딩 true로
      refreshing: false,
      five_users: [],
      page: 1,
      page_loading: false,
      no_more: false,
    };
  }

  componentDidMount() {
    this.five.fiveUserList(this.state.category, this.state.favorable_id, this.state.page, (res) => {
      this.setState({
        five_users: res.data.five_users, no_more: res.data.no_more
      });
    }).then(() => this.setState({ loading: false }));
  }

  _onRefresh() {
    this.setState({ refreshing: true, page: 1 }, () => {
      this.five.fiveUserList(this.state.category, this.state.favorable_id, this.state.page, (res) => {
        this.setState({
          five_users: res.data.five_users, no_more: res.data.no_more
        });
      }).then(() => this.setState({ refreshing: false }));
    });
  }

  nextPage() {
    this.setState({ page: this.state.page + 1, page_loading: true, }, () => {
      this.five.fiveUserList(this.state.category, this.state.favorable_id, this.state.page, (res) => {
        if (res.data.no_more) {
          this.setState({ no_more: true });
        }
        this.setState({
          five_users: [ ...this.state.five_users, ...res.data.five_users ], no_more: res.data.no_more
        });
      }).then(() => this.setState({ page_loading: false }));
    });
  }

  render() {
    const { container, preLoading } = BaseStyle;
    const { navigation } = this.props;

    return (
      <Container>
        <NavBar
          leftButton
          leftAsImage
          leftIcon={require('../../assets/images/back_icon_pink.png')}
          onPressLeft={() => navigation.goBack()}
          headerText={`FIVE한 사람들`}
        />
        <Content refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }>
          <FlatList
            data={this.state.five_users}
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
