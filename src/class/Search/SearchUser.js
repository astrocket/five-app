import React, { Component } from 'react';
import {
  View, TouchableOpacity, FlatList, Alert, Keyboard,
} from 'react-native';
import {
  Container, Header, Content, Text, Spinner,
  Item, Input, Icon, List, ListItem,
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import {
  FiveUnitBar, ElevenHeader, RowHeaderBar, EmptyBox, ShowMore, SearchUserUnitBar,
} from '../../component/common';
import UserContacts from '../Device/UserContacts';
import axios from 'axios';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('ApplicationStore') // Inject some or all the stores!
@observer
export default class SearchUser extends Component {

  static navigationOptions = ({ navigation }) => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      header: {
        headers: {
          'X-User-Email': this.props.ApplicationStore.email,
          'X-User-Token': this.props.ApplicationStore.token,
        },
      },
      page: 1,
      page_loading: false,
      input_search: '',
      no_more: true,
      users: [],
      searched: false,
      no_result: true,
      headerShow: true
    }
  }

  searchUser() {
    this.setState({ loading: true });
    axios.get(`${ApiServer.USERS}/search_user?s=${this.state.input_search}&page=${this.state.page}`, this.state.header)
      .then((res) => {
        if (res.data.users.length > 0) {
          this.setState({ loading: false, no_result: false, searched: true, users: res.data.users, no_more: res.data.no_more, page_loading: false})
        } else {
          this.setState({ loading: false, no_result: true, searched: true, users: res.data.users, no_more: res.data.no_more, page_loading: false})
        }
      }).catch((e) => console.log(e.response));
  }

  nextPageUser() {
    this.setState({ loading: true });
    axios.get(`${ApiServer.USERS}/search_user?s=${this.state.input_search}&page=${this.state.page}`, this.state.header)
      .then((res) => {
        this.setState({ loading: false, no_result: false, searched: true, users: [ ...this.state.users, ...res.data.users], no_more: res.data.no_more, page_loading: false})
      }).catch((e) => console.log(e.response));
  }

  handleInputSearch(input_search) {
    if (input_search === '') {
      this.setState({ searched: false, input_search: input_search });
    } else {
      this.setState({ input_search });
    }
  }

  handleScroll(e) {
    var currentOffset = e.nativeEvent.contentOffset.y;
    var headerShow = currentOffset < 100;
    this.setState({ headerShow });
  }

  renderNextPageButton() {
    if (this.state.no_more) {
      return null;
    }

    return (
      <ShowMore
        onPress={() => this.nextPageUser()}
        moreText={'더보기'}
        overText={'끝'}
        no_more={this.state.no_more}
        page_loading={this.state.page_loading}
      />
    );
  }

  renderSearchResult() {
    if (this.state.searched) {
      if (this.state.no_result) {
        return (
          <View style={{
            justifyContent: 'center', alignItems: 'center', flex: 1, flexDirection: 'column',
          }}>
            <Text>검색 결과가 없습니다</Text>
          </View>
        );
      } else {
        return (
          <Content onScroll={(e) => this.handleScroll(e)}>
            <FlatList
              data={this.state.users}
              renderItem={({ item, index }) => (
                <SearchUserUnitBar
                  user={item}
                  onPress={() => this.props.navigation.navigate('UserShow', {
                    user: item,
                    title: item.name,
                  })}
                />
              )}
              keyExtractor={item => 'search-five-list-' + item.id}
              ListHeaderComponent={
                <UserContacts showContacts navigation={this.props.navigation}/>
              }
              ListFooterComponent={
                this.renderNextPageButton()
              }
            />
          </Content>
        );
      }
    } else {
      if (this.props.suggestions.length > 0) {
        return (
          <Content onScroll={(e) => this.handleScroll(e)}>
            <FlatList
              data={this.props.suggestions}
              renderItem={({ item, index }) => (
                <SearchUserUnitBar
                  user={item}
                  onPress={() => this.props.navigation.navigate('UserShow', {
                    user: item,
                    title: item.name,
                  })}
                />
              )}
              keyExtractor={item => 'search-user-suggestion-list-' + item.id}
              ListHeaderComponent={
                <View>
                  <UserContacts showContacts navigation={this.props.navigation}/>
                  <RowHeaderBar
                    title={'팔로워 추천'}
                  />
                </View>
              }
            />
          </Content>
        );
      } else {
        return (
          <View style={{
            justifyContent: 'center', alignItems: 'center', flex: 1, flexDirection: 'column',
          }}>
            <Text>궁금한 친구를 검색해 보세요</Text>
          </View>
        );
      }
    }
  }

  render () {
    const { container, preLoading } = BaseStyle;
    const { navigation } = this.props;

    return (
      <Container keyboardShouldPersistTaps={'always'}>
        <ElevenHeader
          headerShow={this.state.headerShow}
          title={`친구찾기`}/>
        <Header searchBar rounded style={{
          paddingTop: 0,
          height: 56,
        }}>
          <Item>
            <Icon name="ios-search"/>
            <Input
              placeholder={`좋아하는 유저를 검색해서 팔로우 해보세요`}
              autoCapitalize={'none'}
              autoCorrect={false}
              autoFocus={true}
              multiline={false}
              value={this.state.input_search}
              returnKeyType={'search'}
              onSubmitEditing={() => this.setState({page:1}, this.searchUser(this.state.input_search))}
              onChangeText={(input_search) => this.handleInputSearch(input_search)}
            />
            <TouchableOpacity onPress={() => this.setState({
              input_search: '',
              searched: false,
            })}>
              <Icon name="md-close"/>
            </TouchableOpacity>
          </Item>
        </Header>
        {this.renderSearchResult()}
        {(this.state.loading || this.props.loading) &&
        <View style={preLoading}>
          <Spinner size="large"/>
        </View>
        }
      </Container>
    );
  }
}