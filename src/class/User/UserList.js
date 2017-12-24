import React, { Component } from 'react';
import {
  View,
  FlatList,
} from 'react-native';
import {
  Container,
  Header,
  Content,
  Text,
  Spinner,
} from 'native-base';
import {
  Col,
  Row,
  Grid,
} from 'react-native-easy-grid';
import { UserUnitBar, ShowMore } from '../../component/common';
import axios from 'axios';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import ApplicationStore from '../../mobx/ApplicationStore';

export default class UserList extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: '최근 유저들',
    ...Constant.FiveNavOptions,
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: false, //실서비스에서는 로딩 true로
      users: [],
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
    axios.get(`${ApiServer.RESTAURANTS}/users?page=${this.state.page}`, config)
      .then((response) => {
        this.setState({
          loading: false,
          users: response.data,
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
    axios.get(`${ApiServer.RESTAURANTS}/users?page=${this.state.page}`, config)
      .then((response) => {
        if (response.data === undefined || response.data.length === 0) {
          this.setState({ no_more: true });
        }
        this.setState({
          users: [ ...this.state.users, ...response.data ],
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
        <Content>
          <FlatList
            data={this.state.users}
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
