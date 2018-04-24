import React, { Component } from 'react';
import {
  View, FlatList, Alert, ListView, Keyboard, TouchableOpacity, Image,
} from 'react-native';
import {
  Container, Header, Content, Text, Spinner,
  Item, Input, Button, Toast, Left, Body, Title, Right,
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import { SearchFiveUnitBar, ShowMore, ElevenHeader, RowHeaderBar, EmptyBox } from '../../component/common';
import * as Constant from '../../config/Constant';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

import Icon from 'react-native-vector-icons/FontAwesome';

@inject('stores') @observer
export default class SearchFive extends Component {

  static navigationOptions = ({ navigation }) => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.app = this.props.stores.app;
    this.server = this.props.stores.server;
    this.five = this.props.stores.five;
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      loading: true,
      category: this.props.navigation.state.params.category,
      category_korean: this.props.navigation.state.params.category_korean,
      klass: this.props.navigation.state.params.klass,
      page: 1,
      page_loading: false,
      input_search: '',
      methods: this.five.methodsPerApi(this.props.navigation.state.params.category, this.props.screenProps.modalNavigation),
      no_more: true,
      chunks: [],
      searched: false,
      no_result: true,
      wishes: [],
      headerShow: true,
    };
  }

  componentDidMount() {
    this.server.profileCategoryWish((data) => this.setState(data), this.state.category, (res) => this.setState({wishes: res.data.categories[0].wishes}))
      .then(() => {
        this.setState({ loading: false })
      });
  }

  /* Wish to Five */

  toggleWishCall(item, index) {
    this.onClickToggleWish(item, index)
      .then(() => {
        const category = this.state.category;
        const id = item.wish.id;
        if (item.also_five) {
          this.five.fiveDestroy(category, id, (res) => this.onWishToFiveDestroySuccess(res.data, index));
        } else {
          this.five.fiveCreate(category, id, (res) => this.onWishToFiveCreateSuccess(res.data, index));
        }
      }
    );
  }

  async onClickToggleWish(item, index) {
    const stateBefore = [ ...this.state.wishes ];
    stateBefore[ index ].loading = true;
    await this.setState({ wishes: stateBefore });
  }

  async onWishToFiveCreateSuccess(data, index) {
    const stateBefore = [...this.state.wishes];
    stateBefore[index].also_five = true;
    stateBefore[index].loading = false;
    stateBefore[index].wish.five_users_count += 1;
    const have = await this.app.hasCategory(this.state.category);
    if (have) {
      this.setState({ wishes: stateBefore })
    } else {
      this.app.updateCategories().then(() => {
        this.setState({ wishes: stateBefore })
      });
    }
  }

  onWishToFiveDestroySuccess(data, index) {
    const stateBefore = [...this.state.wishes];
    stateBefore[index].also_five = false;
    stateBefore[index].loading = false;
    stateBefore[index].wish.five_users_count -= 1;
    this.setState({ wishes: stateBefore });
  }

  /* Wish to Five end */

  toggleFive(chunk, index) {
    this.onClickToggleFive(chunk, index)
      .then(() => {
        if (chunk.already_five) {
          // 이미 파이브면 삭제 시도
          this.five.fiveDestroy(this.state.category, chunk.id, (res) => this.onFiveDestroySuccess(res.data, index));
        } else {
          this.state.methods.add_five_api(chunk, index, this.five.namesPerApi(this.state.category, chunk).title, (res) => {
            this.onFiveCreateSuccess(chunk, index, res.data);
          }, (e) => this.onFiveCreateFailed(e, chunk, index))
        }
      }
    );
  }

  async onClickToggleFive(chunk, index) {
    const chunksBefore = [ ...this.state.chunks ];
    chunksBefore[ index ].loading = true;
    await this.setState({ chunks: chunksBefore });
  }

  onFiveDestroySuccess(chunk, index) {
    const chunksBefore = [ ...this.state.chunks ];
    chunksBefore[ index ].already_five = false;
    chunksBefore[ index ].loading = false;
    chunksBefore[ index ].five_users_count -= 1;
    this.setState({ chunks: chunksBefore });
  }

  onFiveCreateSuccess(chunk, index, data) {
    const chunksBefore = [ ...this.state.chunks ];
    chunksBefore[ index ] = data.five;
    chunksBefore[ index ].already_five = true;
    chunksBefore[ index ].loading = false;
    if (data.first_kiss) {
      this.app.updateCategories().then(() => {
        this.setState({ chunks: chunksBefore })
      });
    } else {
      this.setState({ chunks: chunksBefore })
    }
  }

  onFiveCreateFailed(error, chunk, index) {
    Alert.alert(
      `${JSON.stringify(error.response.data.errors[0])}`,
      `${this.five.namesPerApi(this.state.category, chunk).title}을(를) ${this.state.category_korean} 보관함에 담으시겠어요?`,
      [ { text: '아니요', style: 'cancel', },
        { text: '네', onPress: () => this.state.methods.add_wish_api(chunk, index, this.five.namesPerApi(this.state.category, chunk).title) }, ],
      { cancelable: true },
    );
  }
  // 백엔드 단 카카오 검색 관련

  handleInputSearch(input_search) {
    if (input_search === '') {
      this.setState({ searched: false, no_result: true, input_search: input_search });
    } else {
      this.setState({ input_search });
    }
  }

  handleScroll(e) {
    var currentOffset = e.nativeEvent.contentOffset.y;
    var headerShow = currentOffset < 50;
    this.setState({ headerShow });
  }

  submitSearch() {
    this.setState({ page:1, loading: true }, () => {
      this.state.methods.search_api(this.state.input_search, this.state.page, (data) => this.setState(data))
        .then(() => {
          this.setState({ loading: false });
        });
    });
  }

  nextPage() {
    this.setState({ page: this.state.page + 1, page_loading: true }, () => {
      this.state.methods.next_page(this.state.input_search, this.state.page, this.state.chunks, (data) => this.setState(data))
        .then(() => {
          this.setState({ page_loading: false });
        });
    });
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
            justifyContent: 'flex-start', alignItems: 'center', flex: 1, flexDirection: 'column',
          }}>
            <EmptyBox
              barWidth={Constant.deviceWidth - 20}
              message={`검색 결과가 없어요. ${'\n'}다른 검색어로 다시 시도해 보세요!`}
              barHeight={100}
              borderRadius={10}
              marginRight={10}
            />
          </View>
        );
      } else {
        return (
          <Content onScroll={(e) => this.handleScroll(e)} key={'content-chunks'}>
            <FlatList
              data={this.state.chunks}
              renderItem={({ item, index }) => (
                <SearchFiveUnitBar
                  id={item.id}
                  category={this.state.category}
                  image_url={this.five.namesPerApi(this.state.category, item).image}
                  title={this.five.namesPerApi(this.state.category, item).title}
                  subtitle={this.five.namesPerApi(this.state.category, item).subtitle}
                  friends_info={item.five_users_count ? `FIVE ${item.five_users_count}` : null}
                  clicked={item.already_five}
                  loading={item.loading}
                  onPress={() => this.toggleFive(item, index)}
                  onPressImage={() => this.state.methods.onclick_image(item)}
                />
              )}
              keyExtractor={item => 'search-five-list-' + this.five.namesPerApi(this.state.category, item).id}
              ListFooterComponent={
                this.renderNextPageButton()
              }
            />
          </Content>
        );
      }
    } else {
      if (this.state.wishes.length > 0) {
        return (
          <Content onScroll={(e) => this.handleScroll(e)} key={'content-wishes'}>
            <FlatList
              data={this.state.wishes}
              renderItem={({ item, index }) => (
                <SearchFiveUnitBar
                  id={item.wish.id}
                  image_url={item.wish.image_medium_url}
                  title={item.wish.title}
                  subtitle={item.wish.subtitle}
                  clicked={item.also_five}
                  loading={item.loading}
                  friends_info={`FIVE ${item.wish.five_users_count}`}
                  onPress={() => this.toggleWishCall(item, index, this.five.namesPerApi(this.state.category, item.wish).title)}
                  onPressImage={() => this.props.navigation.navigate('FiveShow', {
                    category: this.state.category,
                    id: item.wish.id,
                    title: item.wish.title,
                  })}
                />
              )}
              keyExtractor={item => 'five-wish-list-' + item.wish.id}
              ListHeaderComponent={
                <RowHeaderBar
                  title={`보관함의 ${this.state.category_korean} 중에서도 선택할 수 있어요.`}
                />
              }
            />
          </Content>
        );
      } else {
        return (
          <View style={{
            justifyContent: 'flex-start', alignItems: 'center', flex: 1, flexDirection: 'column', backgroundColor: 'white', paddingTop: 100,
          }}>
            <Image style = {{ width: 100, height: 100 }} source = {require('../../assets/images/sign_up_done.png')} />
          </View>
        );
      }
    }
  }

  render() {
    const { container, preLoading } = BaseStyle;
    const { navigation } = this.props;

    return (
      <Container keyboardShouldPersistTaps={'always'}>
        <ElevenHeader
          headerShow={this.state.headerShow}
          title={`${this.state.category_korean} 검색`}
          custom
          rightButton
          buttonIcon={'times-circle'}
          onPressRight={() => navigation.goBack()} />
        <Header searchBar rounded style={{
          paddingTop: 0,
          height: 56,
          elevation: 0,
          borderBottomWidth: 0,
          backgroundColor: 'white',
        }}>
          <Item style = {{ backgroundColor: Constant.LightGrey, height: 44, borderRadius: 12 }}>
            <Icon name="search" style={{ fontSize: 26, color: 'grey', marginLeft: 12, marginRight: 6 }}/>
            <Input
              showLoading
              placeholderTextColor={Constant.GreyColor}
              placeholder={`좋아하는 ${this.state.category_korean}을 찾아 보세요...`}
              autoCapitalize={'none'}
              autoCorrect={false}
              autoFocus={true}
              multiline={false}
              value={this.state.input_search}
              returnKeyType={'search'}
              onSubmitEditing={() => this.submitSearch()}
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
        {this.state.loading &&
        <View style={preLoading}>
          <Spinner size="large"/>
        </View>
        }
      </Container>
    );
  }
}
