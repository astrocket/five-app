import React, { Component } from 'react';
import {
  View, FlatList, Alert, ListView, Keyboard,
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
export default class ProfileFiveAddBook extends Component {

  static navigationOptions = ({ navigation }) => ({
    header: null,
    drawerLockMode: 'locked-closed',
  });

  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      loading: false,
      category: this.props.navigation.state.params.category,
      category_korean: this.props.navigation.state.params.category_korean,
      klass: this.props.navigation.state.params.klass,
      page: 1,
      page_loading: false,
      input_search: '',
      no_more: true,
      documents: [],
      clicked: [],
      searched: false,
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

    const header = {
      headers: {
        'X-User-Email': this.props.ApplicationStore.email,
        'X-User-Token': this.props.ApplicationStore.token,
      },
    };

    axios.post(`${ApiServer.MY_PROFILE}/create_five?category=${this.state.category}`, data, header)
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
    //documentsBefore.splice(index, 1);
    stateBefore[ index ].clicked = true;
    this.setState({ wishes: stateBefore });
  }

  // 보관함 담기 끝

  // 카카오 검색결과 추가 하기 시작
  addFive(document, index) {
    axios.post(`${ApiServer.MY_PROFILE}/add_or_create_five?category=${this.state.category}`, {
      document: document,
    }, {
      headers: {
        'X-User-Email': this.props.ApplicationStore.email,
        'X-User-Token': this.props.ApplicationStore.token,
      },
    }).then((response) => {
      this.onAddFiveSuccess(response.data, document, index);
    }).catch((error) => {
      Toast.show({
        text: JSON.stringify(error.response.data.errors),
        position: 'bottom',
        duration: 1500,
      });
    });
  }

  askAddFive(document, index) {
    Alert.alert(
      'FIVE 선택 확인',
      `${document.title}을(를) ${this.state.category_korean} FIVE로 선택하시겠어요?`,
      [
        {
          text: '아니요',
          style: 'cancel',
        },
        {
          text: '네',
          onPress: () => this.addFive(document, index),
        },
      ],
      { cancelable: true },
    );
  }

  onAddFiveSuccess(data, document, index) {
    const documentsBefore = [ ...this.state.documents ];
    //tracksBefore.splice(index, 1);
    documentsBefore[ index ].clicked = true;
    this.setState({ documents: documentsBefore }, () => {
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
        message = `${document.title}이(가) ${this.state.category_korean} FIVE로 선택되었습니다. 아직 ${5 - data.fives_count}개를 더 선택할 수 있어요!`,
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

  // 카카오 검색 결과 추가하기 끝

  // 백엔드 단 카카오 검색 관련 시작
  searchApiKakao(input_search) {
    this.setState({ loading: true });
    const config = {
      headers: {
        'X-User-Email': this.props.ApplicationStore.email,
        'X-User-Token': this.props.ApplicationStore.token,
      },
    };
    axios.get(`${ApiServer.BOOKS}/search_kakao?s=${input_search}&page=${this.state.page}`, config)
      .then((response) => {
        if (response.data.documents.length > 0) {
          this.setState({
            loading: false,
            no_result: false,
            searched: true,
            documents: response.data.documents,
            no_more: response.data.meta.is_end,
            page_loading: false,
          });
        } else {
          this.setState({
            loading: false,
            no_result: true,
            searched: false,
            documents: response.data.documents,
            no_more: response.data.meta.is_end,
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
      axios.get(`${ApiServer.BOOKS}/search_kakao?s=${this.state.input_search}&page=${this.state.page}`, config)
        .then((response) => {
          console.log(response);
          this.setState({
            loading: false,
            documents: [ ...this.state.documents, ...response.data.documents ],
            no_more: response.data.meta.is_end,
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
      this.setState({ searched: false });
      Keyboard.dismiss();
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

  // 카카오 검색 관련 끝

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
            <Text>결과 없음 !</Text>
          </View>
        );
      } else {
        return (
          <Content onScroll={(e) => this.handleScroll(e)}>
            <FlatList
              data={this.state.documents}
              renderItem={({ item, index }) => (
                <SearchFiveUnitBar
                  id={item.id}
                  image_url={item.image_medium_url || item.thumbnail}
                  title={item.title}
                  subtitle={item.subtitle || item.authors}
                  friends_info={item.five_users_count ? `FIVE ${item.five_users_count}` : null}
                  clicked={item.clicked}
                  onPress={() => this.askAddFive(item, index)}
                  onPressImage={() => this.props.screenProps.modalNavigation.navigate('Map', {
                    lng: item.x,
                    lat: item.y,
                    title: item.title,
                  })}
                />
              )}
              keyExtractor={item => 'search-five-list-' + item.isbn + item.authors + item.datetime}
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
                  title={'클립해 둔 아래 책들 중에서도 선택할 수 있어요.'}
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
          title={'책 FIVE 추가'} custom rightButton
          onPressRight={() => navigation.goBack()} buttonIcon={'md-close-circle'}>
          <Left/>
          <Body>
          <Title>{'책 FIVE 추가'}</Title>
          </Body>
          <Right>
            <Button onPress={() => navigation.goBack()} transparent>
              <Icon
                name="md-close-circle"
                style={{
                  fontSize: 25,
                  color: Constant.FiveColor,
                }}
              />
            </Button>
          </Right>
        </ElevenHeader>
        <Header searchBar rounded style={{
          paddingTop: 0,
          height: 56,
        }}>
          <Item>
            <Icon name="ios-search"/>
            <Input
              placeholder="좋아하는 책을 검색해서 FIVE로 추가하세요"
              autoCapitalize={'none'}
              autoCorrect={false}
              autoFocus={true}
              multiline={false}
              returnKeyType={'search'}
              onSubmitEditing={() => this.setState({page: 1}, () => this.searchApiKakao(this.state.input_search))}
              onChangeText={(input_search) => this.handleInputSearch(input_search)}
            />
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