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
import axios from 'axios';
import { NavigationActions } from 'react-navigation';
import { SearchFiveUnitBar, ShowMore, ElevenHeader, RowHeaderBar, EmptyBox } from '../../component/common';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

import Icon from 'react-native-vector-icons/FontAwesome';

@inject('ApplicationStore') // Inject some or all the stores!
@observer
export default class SearchFive extends Component {

  static navigationOptions = ({ navigation }) => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      loading: true,
      header: {
        headers: {
          'X-User-Email': this.props.ApplicationStore.email,
          'X-User-Token': this.props.ApplicationStore.token,
        },
      },
      category: this.props.navigation.state.params.category,
      category_korean: this.props.navigation.state.params.category_korean,
      klass: this.props.navigation.state.params.klass,
      page: 1,
      page_loading: false,
      input_search: '',
      methods: this.methodsPerApi(this.props.navigation.state.params.category),
      no_more: true,
      chunks: [],
      searched: false,
      no_result: true,
      wishes: [],
      headerShow: true,
    };
  }

  componentDidMount() {
    this.apiCall();
  }

  async apiCall() {
    await axios.get(`${ApiServer.MY_PROFILE}/wishes?category=${this.state.category}`, this.state.header)
      .then((response) => {
        this.setState({
          loading: false,
          wishes: response.data.categories[0].wishes,
        });
      }).catch((error) => {console.log(JSON.stringify(error.response))});
  }

  /* Wish to Five */

  createFiveCall(item, index, title) {

    const data = {
      favorable_id: item.wish.id,
    };

    if (item.also_five) {
      axios.post(`${ApiServer.MY_PROFILE}/destroy_five?category=${this.state.category}`, data, this.state.header)
        .then((response) => {
          this.onDestroyFiveCallSuccess(response.data, index);
        }).catch((error) => {Toast.show({ text: '에러 : ' + JSON.stringify(error.response.data.errors), position: 'bottom', duration: 1500, })});
    } else {
      axios.post(`${ApiServer.MY_PROFILE}/create_five?category=${this.state.category}`, data, this.state.header)
        .then((response) => {
          this.onCreateFiveCallSuccess(response.data, index);
        }).catch((error) => {Toast.show({ text: '에러 : ' + JSON.stringify(error.response.data.errors), position: 'bottom', duration: 1500, })});
    }
  }

  onCreateFiveCallSuccess(data, index) {
    const stateBefore = [...this.state.wishes];
    stateBefore[index].also_five = true;
    stateBefore[index].wish.five_users_count += 1;
    this.props.ApplicationStore.updateCategories().then(() => {
      this.setState({ wishes: stateBefore })
    });
  }

  onDestroyFiveCallSuccess(data, index) {
    const stateBefore = [...this.state.wishes];
    stateBefore[index].also_five = false;
    stateBefore[index].wish.five_users_count -= 1;
    this.setState({ wishes: stateBefore });
  }

  /* Wish to Five end */

  methodsPerApi(category) {
    switch (category) {
      case 'restaurant':
       return {
         add_five_api: (c,i,n) => this.addFiveRestaurant(c,i,n),
         add_wish_api: (c,i,n) => this.addWishRestaurant(c,i,n),
         onclick_image: (i) => this.props.screenProps.modalNavigation.navigate('Map', { lng: i.x, lat: i.y, title: this.namesPerApi(i), }),
         next_page: () => this.nextPageRestaurant(),
         search_api: (i) => this.searchApiRestaurant(i),
       };
      case 'music':
        return {
          add_five_api: (c,i,n) => this.addFiveMusic(c,i,n),
          add_wish_api: (c,i,n) => this.addWishMusic(c,i,n),
          onclick_image: (i) => this.props.screenProps.modalNavigation.navigate('ModalWebViewShow', { title: this.namesPerApi(i), url: (i.related_link || i.track_share_url.split('?')[0]) }),
          next_page: () => this.nextPageMusic(),
          search_api: (i) => this.searchApiMusic(i),
        };
      case 'book':
        return {
          add_five_api: (c,i,n) => this.addFiveBook(c,i,n),
          add_wish_api: (c,i,n) => this.addWishBook(c,i,n),
          onclick_image: (i) => this.props.screenProps.modalNavigation.navigate('ModalWebViewShow', { title: this.namesPerApi(i), url: (i.related_link || i.url)}),
          next_page: () => this.nextPageBook(),
          search_api: (i) => this.searchApiBook(i),
        };
      default:
        return {
          add_five_api: this.props.navigation.goBack(),
          add_wish_api: this.props.navigation.goBack(),
          onclick_image: this.props.navigation.goBack(),
          next_page: this.props.navigation.goBack(),
          search_api: this.props.navigation.goBack()
        };
    }
  }

  namesPerApi(chunk) {
    switch (this.state.category) {
      case 'restaurant':
        return {
          title: chunk.place_name,
          subtitle: (chunk.subtitle || chunk.address_name),
          id: chunk.id,
          image: chunk.image_medium_url,
        };
      case 'music':
        return {
          title: chunk.track_name,
          subtitle: (chunk.subtitle || `${chunk.artist_name} / ${chunk.album_name}`),
          id: chunk.track_id,
          image: chunk.image_medium_url,
        };
      case 'book':
        return {
          title: chunk.title,
          subtitle: (chunk.subtitle || chunk.authors),
          id: chunk.isbn + chunk.authors + chunk.datetime,
          image: (chunk.image_medium_url || chunk.thumbnail)
        };
      default:
        return  {
          title: 'n/a',
          subtitle: 'n/a',
          id: 'n/a',
        }
    }
  }

  askAddWish(chunk, index, msg) {
    Alert.alert(
      `${msg}`,
      `${this.namesPerApi(chunk).title}을(를) ${this.state.category_korean} 보관함에 담으시겠어요?`,
      [
        {
          text: '아니요',
          style: 'cancel',
        },
        {
          text: '네',
          onPress: () => this.state.methods.add_wish_api(chunk, index, this.namesPerApi(chunk).title)
        },
      ],
      { cancelable: true },
    );
  }

  toggleFive(chunk, index) {
    const beforeChunks = [...this.state.chunks];
    if (beforeChunks[ index ].already_five) {
      console.log('toggle clicked !');
      this.deleteFiveCall(chunk, index);
    } else {
      this.state.methods.add_five_api(chunk, index, this.namesPerApi(chunk).title)
    }
    console.log('came nowhere');
  }

  deleteFiveCall(chunk, index) {
    console.log('delete function reached');
    const data = { favorable_id: chunk.id };
    axios.post(`${ApiServer.MY_PROFILE}/destroy_five?category=${this.state.category}`, data, this.state.header)
      .then((res) => {
        this.onDeleteFiveSuccess(chunk, index)
      }).catch((error) => {Toast.show({ text: '에러 : ' + JSON.stringify(error.response.data.errors), position: 'bottom', duration: 1500, });
    });
  }

  onAddFiveSuccess(chunk, index, five) {
    const chunksBefore = [ ...this.state.chunks ];
    chunksBefore[ index ] = five;
    this.props.ApplicationStore.updateCategories().then(() => {
      this.setState({ chunks: chunksBefore })
    });
  }

  onDeleteFiveSuccess(chunk, index) {
    const chunksBefore = [ ...this.state.chunks ];
    chunksBefore[ index ].already_five = false;
    chunksBefore[ index ].five_users_count -= 1;
    this.setState({ chunks: chunksBefore });
  }

  // 카카오 맛집 검색결과 추가 하기 시작
  addFiveRestaurant(document, index, title) {
    axios.get(`${ApiServer.KAKAO_GEO_API}?x=${document.x}&y=${document.y}&input_coord=WGS84`, { headers: { 'Authorization': ApiServer.KAKAO_API_KEY, }, })
      .then((response) => {
      axios.post(`${ApiServer.MY_PROFILE}/add_or_create_five?category=${this.state.category}`, { zipcode: response.data.documents[ 0 ].road_address.zone_no, chunk: document, }, this.state.header)
        .then((response) => {
        this.onAddFiveSuccess(document, index, response.data.five);
      }).catch((error) => {
        this.askAddWish(document, index, JSON.stringify(error.response.data.errors[0]));
      });
    }).catch((error) => {
      Toast.show({
        text: JSON.stringify(error.response.data),
        position: 'bottom',
        duration: 1500,
      });
    });
  }

  // 뮤직스 검색결과 추가 하기 시작
  addFiveMusic(track, index, title) {
    axios.post(`${ApiServer.MY_PROFILE}/add_or_create_five?category=${this.state.category}`, { chunk: track, }, this.state.header).then((response) => {
      this.onAddFiveSuccess(track, index, response.data.five);
    }).catch((error) => {
      this.askAddWish(track, index, JSON.stringify(error.response.data.errors[0]));
    });
  }

  // 카카오 책 검색결과 추가 하기 시작
  addFiveBook(document, index, title) {
    axios.post(`${ApiServer.MY_PROFILE}/add_or_create_five?category=${this.state.category}`, { chunk: document, }, this.state.header).then((response) => {
      this.onAddFiveSuccess(document, index, response.data.five);
    }).catch((error) => {
      this.askAddWish(document, index, JSON.stringify(error.response.data.errors[0]));
    });
  }

  // 카카오 맛집 검색결과 추가 하기 시작
  addWishRestaurant(document, index, title) {
    axios.get(`${ApiServer.KAKAO_GEO_API}?x=${document.x}&y=${document.y}&input_coord=WGS84`, { headers: { 'Authorization': ApiServer.KAKAO_API_KEY, }, })
      .then((response) => {
        axios.post(`${ApiServer.MY_PROFILE}/add_and_create_wish?category=${this.state.category}`, { zipcode: response.data.documents[ 0 ].road_address.zone_no, chunk: document, }, this.state.header).then((response) => {
            Toast.show({
              text:`${title}이 보관함에 추가되었습니다.`,
              position: 'bottom',
              duration: 1500,
            });
          }).catch((error) => {
          Toast.show({
            text: JSON.stringify(error.response.data),
            position: 'bottom',
            duration: 1500,
          });
        });
      }).catch((error) => {
      Toast.show({
        text: JSON.stringify(error.response.data),
        position: 'bottom',
        duration: 1500,
      });
    });
  }

  // 뮤직스 검색결과 추가 하기 시작
  addWishMusic(track, index, title) {
    axios.post(`${ApiServer.MY_PROFILE}/add_and_create_wish?category=${this.state.category}`, { chunk: track, }, this.state.header).then((response) => {
      Toast.show({
        text:`${title}이 보관함에 추가되었습니다.`,
        position: 'bottom',
        duration: 1500,
      });
    }).catch((error) => {
      Toast.show({
        text: JSON.stringify(error.response.data),
        position: 'bottom',
        duration: 1500,
      });
    });
  }

  // 카카오 책 검색결과 추가 하기 시작
  addWishBook(document, index, title) {
    axios.post(`${ApiServer.MY_PROFILE}/add_and_create_wish?category=${this.state.category}`, { chunk: document, }, this.state.header).then((response) => {
      Toast.show({
        text:`${title}이 보관함에 추가되었습니다.`,
        position: 'bottom',
        duration: 1500,
      });
    }).catch((error) => {
      Toast.show({
        text: JSON.stringify(error.response.data),
        position: 'bottom',
        duration: 1500,
      });
    });
  }

  // 백엔드 단 카카오 검색 관련 시작
  searchApiRestaurant(input_search) {
    this.setState({ loading: true });
    axios.get(`${ApiServer.RESTAURANTS}/search_kakao?s=${input_search}&page=${this.state.page}`, this.state.header)
      .then((response) => {
        if (response.data.documents.length > 0) {
          this.setState({ loading: false, no_result: false, searched: true, chunks: response.data.documents, no_more: response.data.meta.is_end, page_loading: false, });
        } else {
          this.setState({ loading: false, no_result: true, searched: false, chunks: response.data.documents, no_more: response.data.meta.is_end, page_loading: false, });
        }
      }).catch((error) => {console.log(error.response);});
  }

  nextPageRestaurant() {
    this.setState({ page: this.state.page + 1, page_loading: true, }, () => {
      axios.get(`${ApiServer.RESTAURANTS}/search_kakao?s=${this.state.input_search}&page=${this.state.page}`, this.state.header)
        .then((response) => {
          this.setState({ loading: false, chunks: [ ...this.state.chunks, ...response.data.documents ], no_more: response.data.meta.is_end, page_loading: false, });
        }).catch((error) => {console.log(error.response);});
    });
  }

  // 백엔드 단 뮤직스 검색 관련 시작
  searchApiMusic(input_search) {
    this.setState({ loading: true });
    axios.get(`${ApiServer.MUSICS}/search_musix?s=${input_search}&page=${this.state.page}`, this.state.header)
      .then((response) => {
        if (response.data.tracks.length > 0) {
          this.setState({ loading: false, no_result: false, searched: true, chunks: response.data.tracks, no_more: response.data.no_more, page_loading: false, });
        } else {
          this.setState({ loading: false, no_result: true, searched: false, chunks: response.data.tracks, no_more: response.data.no_more, page_loading: false, });
        }
      }).catch((error) => {console.log(error.response);});
  }

  nextPageMusic() {
    this.setState({ page: this.state.page + 1, page_loading: true, }, () => {
      axios.get(`${ApiServer.MUSICS}/search_musix?s=${this.state.input_search}&page=${this.state.page}`, this.state.header)
        .then((response) => {
          this.setState({
            loading: false, chunks: [ ...this.state.chunks, ...response.data.tracks ], no_more: response.data.no_more, page_loading: false,
          });
        }).catch((error) => {console.log(error.response);});
    });
  }

  // 책검색
  searchApiBook(input_search) {
    this.setState({ loading: true });
    axios.get(`${ApiServer.BOOKS}/search_kakao?s=${input_search}&page=${this.state.page}`, this.state.header)
      .then((response) => {
        if (response.data.documents.length > 0) {
          this.setState({ loading: false, no_result: false, searched: true, chunks: response.data.documents, page_loading: false, });
        } else {
          this.setState({ loading: false, no_result: true, searched: false, chunks: response.data.documents, no_more: response.data.meta.is_end, page_loading: false, });
        }
      }).catch((error) => {console.log(error.response);});
  }

  nextPageBook() {
    this.setState({ page: this.state.page + 1, page_loading: true, }, () => {
      axios.get(`${ApiServer.BOOKS}/search_kakao?s=${this.state.input_search}&page=${this.state.page}`, this.state.header)
        .then((response) => {this.setState({ loading: false, chunks: [ ...this.state.chunks, ...response.data.documents ], no_more: response.data.meta.is_end, page_loading: false, });
        }).catch((error) => {console.log(error.response);});
    });
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

  // 카카오 검색 관련 끝

  renderSearchResult() {
    if (this.state.searched) {
      if (this.state.no_result) {
        return (
          <View style={{
            justifyContent: 'center', alignItems: 'center', flex: 1, flexDirection: 'column',
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
                  image_url={this.namesPerApi(item).image}
                  title={this.namesPerApi(item).title}
                  subtitle={this.namesPerApi(item).subtitle}
                  friends_info={item.five_users_count ? `FIVE ${item.five_users_count}` : null}
                  clicked={item.already_five}
                  onPress={() => this.toggleFive(item, index)}
                  onPressImage={() => this.state.methods.onclick_image(item)}
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
                  friends_info={`FIVE ${item.wish.five_users_count}`}
                  onPress={() => this.createFiveCall(item, index, this.namesPerApi(item.wish).title)}
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
            justifyContent: 'center', alignItems: 'center', flex: 1, flexDirection: 'column', backgroundColor: 'white',
          }}>
            <Image style = {{ width: 100, height: 100 }} source = {require('../../assets/images/sign_up_done.png')} />
          </View>
        );보
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
              cancelButtonTitle={'취소'}
              value={this.state.input_search}
              returnKeyType={'search'}
              onSubmitEditing={() => this.setState({page:1},this.state.methods.search_api(this.state.input_search))}
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
