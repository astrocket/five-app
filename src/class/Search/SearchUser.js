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
  FiveUnitBar, ElevenHeader, RowHeaderBar, EmptyBox, TabIcon,
} from '../../component/common';
import axios from 'axios';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('ApplicationStore') // Inject some or all the stores!
@observer
export default class SearchUser extends Component {

  constructor(props) {
    super(props);

  }

  searchUser() {

  }

  nextPageUser() {

  }

  toggleUserFollow() {

  }

  handleInputSearch(input_search) {
    if (input_search === '') {
      this.setState({ searched: true, no_result: true, input_search: input_search });
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
        onPress={() => this.state.methods.next_page()}
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
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            flexDirection: 'column',
          }}>
            <Text>검색 결과가 없습니다</Text>
          </View>
        );
      } else {
        return (
          <Content onScroll={(e) => this.handleScroll(e)}>
            <FlatList
              data={this.state.chunks}
              renderItem={({ item, index }) => (
                <SearchFiveUnitBar
                  id={item.id}
                  category={this.state.category}
                  image_url={this.namesPerApi(item).image}
                  title={this.namesPerApi(item).title}
                  subtitle={this.namesPerApi(item).subtitle}
                  friends_info={item.five_users_count ? `FIVE ${item.five_users_count}` : null}
                  clicked={item.clicked}
                  onPress={() => this.askAddFive(item, index)}
                  onPressImage={() => this.props.screenProps.modalNavigation.navigate('Map', {
                    lng: item.x,
                    lat: item.y,
                    title: item.place_name,
                  })}
                />
              )}
              keyExtractor={item => 'search-five-list-' + this.namesPerApi(item).id}
              ListFooterComponent={
                this.renderNextPageButton()
              }
            />
          </Content>
        );
      }
    } else {
      if (this.state.wishes) {
        return (
          <Content onScroll={(e) => this.handleScroll(e)}>
            <FlatList
              data={this.state.wishes}
              renderItem={({ item, index }) => (
                <SearchFiveUnitBar
                  id={item.id}
                  image_url={item.image_medium_url}
                  title={item.title}
                  subtitle={item.subtitle}
                  clicked={item.clicked}
                  friends_info={`FIVE ${item.five_users_count}`}
                  onPress={() => this.askAddWishToFive(item, index)}
                  onPressImage={() => this.props.navigation.navigate('FiveShow', {
                    category: this.state.category,
                    id: item.id,
                    title: item.title,
                  })}
                />
              )}
              keyExtractor={item => 'five-wish-list-' + item.id}
              ListHeaderComponent={
                <RowHeaderBar
                  title={`클립해 둔 아래 ${this.state.category_korean}들 중에서도 선택할 수 있어요.`}
                />
              }
            />
          </Content>
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
          title={`${this.state.category_korean} 검색`}
          custom
          rightButton
          rightAsImage
          buttonIcon={require('../../assets/images/cancel_icon_grey.png')}
          onPressRight={() => navigation.goBack()} />
        <Header searchBar rounded style={{
          paddingTop: 0,
          height: 56,
        }}>
          <Item>
            <Icon name="ios-search"/>
            <Input
              placeholder={`좋아하는 ${this.state.category_korean}을 검색해서 FIVE로 추가하세요`}
              autoCapitalize={'none'}
              autoCorrect={false}
              autoFocus={true}
              multiline={false}
              value={this.state.input_search}
              returnKeyType={'search'}
              onSubmitEditing={() => this.setState({page:1},this.state.methods.search_api(this.state.input_search))}
              onChangeText={(input_search) => this.handleInputSearch(input_search)}
            />
            <TouchableOpacity onPress={() => this.setState({
              input_search: '',
              searched: true,
              no_result: true,
            })}>
              <Icon name="md-close"/>
            </TouchableOpacity>
          </Item>
        </Header>
        {this.renderSearchResult()}
        {this.state.loading &&
        <View style={preLoading}>
          <Spinner size="large"/>
        </View>
        }
      </Container>
    );
  }
}