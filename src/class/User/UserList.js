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
import { FiveUnitBar, ShowMore } from '../../component/common';
import axios from 'axios';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('ApplicationStore') // Inject some or all the stores!
@observer
export default class UserList extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.title,
    ...Constant.FiveNavOptions,
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: true, //실서비스에서는 로딩 true로
      refreshing: false,
      header: {
        headers: {
          'X-User-Email': this.props.ApplicationStore.email,
          'X-User-Token': this.props.ApplicationStore.token,
        },
      },
      users: [],
      page: 1,
      page_loading: false,
      no_more: false,
      search_params: this.props.navigation.state.params.search_params ? this.props.navigation.state.params.search_params : '',
    };
  }

  componentDidMount() {
    this.apiCall();
  }

  async apiCall() {
    await axios.get(`${ApiServer.USERS}/list?page=${this.state.page}&s=${this.state.search_params}`, this.state.header)
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

  _onRefresh() {
    this.setState({refreshing: true, page: 1 });
    this.apiCall().then(() => {
      this.setState({refreshing: false});
    });
  }

  pageCall() {
    axios.get(`${ApiServer.USERS}/list?page=${this.state.page}&s=${this.state.search_params}`, this.state.header)
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
              <FiveUnitBar
                multiple
                id={item.id}
                title={item.name}
                subtitle={item.introduce}
                image_url={item.image_medium_url}
                icon={'ios-arrow-forward-outline'}
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
