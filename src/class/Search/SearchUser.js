import React, { Component } from 'react';
import {
  View, TouchableOpacity, FlatList
} from 'react-native';
import {
  Container, Header, Content, Text, Spinner,
  Item, Input, List, ListItem,
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import {
  ElevenHeader, RowHeaderBar, EmptyBox, ShowMore, SearchUserUnitBar,
} from '../../component/common';
import UserContacts from '../Device/UserContacts';
import * as Constant from '../../config/Constant';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

import Icon from 'react-native-vector-icons/FontAwesome';

@inject('stores') @observer
export default class SearchUser extends Component {

  static navigationOptions = ({ navigation }) => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.app = this.props.stores.app;
    this.server = this.props.stores.server;
    this.state = {
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

  handleInputSearch(input_search) {
    if (input_search === '') {
      this.setState({ searched: false, input_search: input_search });
    } else {
      this.setState({ input_search });
    }
  }

  onSubmit() {
    this.setState({
      page: 1, page_loading: true,
    }, () => {
      this.server.searchUser(this.state, (data) => this.setState(data))
        .then(() => {
          this.setState({ page_loading: false })
        });
    });
  }

  nextPage() {
    this.setState({
      page: this.state.page + 1, page_loading: true,
    }, () => {
      this.server.searchUserPaging(this.state, (data) => this.setState(data))
        .then(() => {
          this.setState({ page_loading: false })
        });
    });
  }

  handleScroll(e) {
    var currentOffset = e.nativeEvent.contentOffset.y;
    var headerShow = currentOffset < 50000;
    this.setState({ headerShow });
  }

  renderNextPageButton() {
    if (this.state.no_more) {
      return null;
    }

    return (
      <ShowMore
        onPress={() => this.nextPage()}
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
            justifyContent: 'center', alignItems: 'center', flex: 1, flexDirection: 'column', backgroundColor: 'white'
          }}>
            <EmptyBox
              barWidth={Constant.deviceWidth}
              message={`검색 결과가 없어요. ${'\n'}다른 아이디로 다시 검색해 보세요!`}
              barHeight={100}
              borderRadius={10}
              marginRight={10}
            />
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
                <RowHeaderBar
                  title={'검색 결과'}
                />
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
                    title={'팔로우 제안'}
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
          custom
          title={`친구찾기`}/>
        <Header searchBar style={{
          paddingTop: 0,
          height: 56,
          elevation: 0,
          borderBottomColor: 'white',
          backgroundColor: 'white',
        }}>
          <Item style = {{ backgroundColor: Constant.LightGrey, height: 40, borderRadius: 12 }}>
            <Icon name="search" style={{ fontSize: 20, color: 'grey', marginLeft: 12, marginRight: 4 }}/>
            <Input
              showLoading
              placeholder={` 아이디로 친구를 찾아 보세요...`}
              placeholderTextColor={Constant.GreyColor}
              autoCapitalize={'none'}
              autoCorrect={false}
              autoFocus={false}
              multiline={false}
              cancelButtonTitle={'취소'}
              value={this.state.input_search}
              returnKeyType={'search'}
              onSubmitEditing={() => this.onSubmit()}
              onChangeText={(input_search) => this.handleInputSearch(input_search)}
            />
            <TouchableOpacity onPress={() => this.setState({
              input_search: '',
              searched: false,
            })}>
              <Icon name="times" style = {{ fontSize: 20, color: 'grey', marginRight: 12 }}/>
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
