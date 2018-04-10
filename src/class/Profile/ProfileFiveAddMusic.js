import React, { Component } from 'react';
import {
  View, FlatList, Alert, ListView, Keyboard, TouchableOpacity
} from 'react-native';
import {
  Container, Header, Content, Text, Spinner,
  Item, Input, Icon, Button, Toast, Left, Body, Title, Right,
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import axios from 'axios';
import { NavigationActions } from 'react-navigation';
import { SearchFiveUnitBar, ShowMore, ElevenHeader, RowHeaderBar } from '../../component/common';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('ApplicationStore') // Inject some or all the stores!
@observer
export default class ProfileFiveAddMusic extends Component {

  static navigationOptions = ({ navigation }) => ({
    header: null,
    drawerLockMode: 'locked-closed',
  });

  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      loading: false,
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
      no_more: true,
      tracks: [],
      clicked: [],
      searched: true,
      no_result: true,
      wishes: this.props.navigation.state.params.wishes,
      headerShow: true,
    };
  }

  // 보관함 담기 시작
  askAddWishToFive(item, index) {
    Alert.alert(
      'FIVE 선택 확인',
      `${item.title}을(를) ${this.state.category_korean} FIVE로 선택하시겠어요?`,
      [
        {
          text: '아니요',
          style: 'cancel',
        },
        {
          text: '네',
          onPress: () => this.createFiveCall(item, index),
        },
      ],
      { cancelable: true },
    );
  }

  createFiveCall(item, index) {
    const data = {
      favorable_id: item.id,
    };

    axios.post(`${ApiServer.MY_PROFILE}/create_five?category=${this.state.category}`, data, this.state.header)
      .then((response) => {
        this.onCreateFiveCallSuccess(response.data, index);
      }).catch((error) => {
      console.log(error.response);
      Toast.show({
        text: '에러 : ' + JSON.stringify(error.response.data.errors),
        position: 'bottom',
        duration: 1500,
      });
    });
  }

  onCreateFiveCallSuccess(data, index) {
    const stateBefore = [ ...this.state.wishes ];
    //tracksBefore.splice(index, 1);
    stateBefore[ index ].clicked = true;
    this.setState({ wishes: stateBefore });
  }

  // 보관함 담기 나중에 추가. api결과도 보관함 담을 떄 db에 레코드 기록해야함

  createWishCall(item, index) {
    let url = `${ApiServer.MY_PROFILE}/create_wish?category=${this.state.category}`;

    const data = {
      favorable_id: item.id,
    };

    if (url) {
      axios.post(url, data, this.state.header)
        .then((response) => {
          Alert.alert(
            '성공',
            `${item.title}이(가) 클립에 추가되었습니다.`,
            [
              {
                text: '확인',
                style: 'cancel',
              },
            ],
            { cancelable: true },
          );
        }).catch((error) => {
        console.log(error.response.data);
        if (error.response.data.full) {
          this.handleOnCreateFiveCallFull();
        } else {
          Toast.show({
            text: '에러 : ' + JSON.stringify(error.response.data.errors),
            position: 'bottom',
            duration: 1500,
          });
        }
      });
    }
  }

  // 뮤직스 검색결과 추가 하기 시작
  addFive(track, index) {
    axios.post(`${ApiServer.MY_PROFILE}/add_or_create_five?category=${this.state.category}`, {
      track: track,
    }, {
      headers: {
        'X-User-Email': this.props.ApplicationStore.email,
        'X-User-Token': this.props.ApplicationStore.token,
      },
    }).then((response) => {
      this.onAddFiveSuccess(response.data, track, index);
    }).catch((error) => {
      Toast.show({
        text: JSON.stringify(error.response.data.errors),
        position: 'bottom',
        duration: 1500,
      });
    });
  }

  askAddFive(track, index) {
    Alert.alert(
      'FIVE 선택 확인',
      `${track.track_name}을(를) ${this.state.category_korean} FIVE로 선택하시겠어요?`,
      [
        {
          text: '아니요',
          style: 'cancel',
        },
        {
          text: '네',
          onPress: () => this.addFive(track, index),
        },
      ],
      { cancelable: true },
    );
  }

  onAddFiveSuccess(data, track, index) {
    const tracksBefore = [ ...this.state.tracks ];
    //tracksBefore.splice(index, 1);
    tracksBefore[ index ].clicked = true;
    this.setState({ tracks: tracksBefore }, () => {
      let message;
      let options;
      const cancel = {
        text: '그만 선택하기',
        onPress: () => this.props.navigation.dispatch(
          NavigationActions.reset({
            index: 1,
            actions: [
              NavigationActions.navigate({
                routeName: 'Main',
              }),
              NavigationActions.navigate({
                routeName: 'ProfileFiveIndex',
                params: { category: this.state.category },
              }),
            ],
          })),
      };
      if (data.fives_count === 5) {
        message = `${this.state.category_korean} FIVE를 모두 선택했어요. 축하해요!`;
        options = [
          cancel
        ]
      } else {
        message = `${track.track_name}이(가) ${this.state.category_korean} FIVE로 선택되었습니다. 아직 ${5 - data.fives_count}개를 더 선택할 수 있어요!`,
        options = [
          cancel,
          {
            text: '더 선택하기',
            style: 'cancel',
          },
        ]
      }
      Alert.alert(
        `${this.state.category_korean} FIVE 선택됨`,
        message,
        options,
        { cancelable: true },
      );
    });
  }

  // 뮤직스 검색 결과 추가하기 끝

  // 백엔드 단 뮤직스 검색 관련 시작
  searchApiMusix(input_search) {
    this.setState({ loading: true });
    const config = {
      headers: {
        'X-User-Email': this.props.ApplicationStore.email,
        'X-User-Token': this.props.ApplicationStore.token,
      },
    };
    axios.get(`${ApiServer.MUSICS}/search_musix?s=${input_search}&page=${this.state.page}`, config)
      .then((response) => {
        if (response.data.tracks.length > 0) {
          this.setState({
            loading: false,
            no_result: false,
            searched: true,
            tracks: response.data.tracks,
            no_more: response.data.no_more,
            page_loading: false,
          });
        } else {
          this.setState({
            loading: false,
            no_result: true,
            searched: false,
            tracks: response.data.tracks,
            no_more: response.data.no_more,
            page_loading: false,
          });
        }
      })
      .catch((error) => {
        console.log(error.response);
      });
  }

  nextPage() {
    this.setState({
      page: this.state.page + 1,
      page_loading: true,
    }, () => {
      const config = {
        headers: {
          'X-User-Email': this.props.ApplicationStore.email,
          'X-User-Token': this.props.ApplicationStore.token,
        },
      };
      axios.get(`${ApiServer.MUSICS}/search_musix?s=${this.state.input_search}&page=${this.state.page}`, config)
        .then((response) => {
          console.log(response);
          this.setState({
            loading: false,
            tracks: [ ...this.state.tracks, ...response.data.tracks ],
            no_more: response.data.no_more,
            page_loading: false,
          });
        })
        .catch((error) => {
          console.log(error.response);
        });
    });
  }

  // 백엔드 단 카카오 검색 관련

  handleInputSearch(input_search) {
    if (input_search === '') {
      this.setState({ searched: true, no_result: true });
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
        onPress={() => this.nextPage()}
        moreText={'더보기'}
        overText={'끝'}
        no_more={this.state.no_more}
        page_loading={this.state.page_loading}
      />
    );
  }

  // 뮤직스 검색 관련 끝

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
              data={this.state.tracks}
              renderItem={({ item, index }) => (
                <SearchFiveUnitBar
                  id={item.id}
                  category={'music'}
                  image_url={item.image_medium_url}
                  title={item.track_name}
                  subtitle={`${item.artist_name} / ${item.album_name}`}
                  friends_info={item.five_users_count ? `FIVE ${item.five_users_count}` : null}
                  clicked={item.clicked}
                  onPress={() => this.askAddFive(item, index)}
                  onPressImage={() => null /*this.props.screenProps.modalNavigation.navigate('ModalWebViewShow', {
                    url: item.track_share_url.split('?')[0],
                    headerTitle: item.track_name
                  })*/}
                />
              )}
              keyExtractor={item => 'search-five-list-' + item.track_id}
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
                  category={'music'}
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
                  title={'클립해 둔 아래 음악들 중에서도 선택할 수 있어요.'}
                />
              }
            />
          </Content>
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
          title={'음악 FIVE 추가'}
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
              placeholder="좋아하는 음악을 검색해서 FIVE로 추가하세요"
              autoCapitalize={'none'}
              autoCorrect={false}
              autoFocus={true}
              multiline={false}
              value={this.state.input_search}
              returnKeyType={'search'}
              onSubmitEditing={() => this.setState({page:1},() => this.searchApiMusix(this.state.input_search))}
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
