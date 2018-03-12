import React, { Component } from 'react';
import {
  View, FlatList, Alert,
} from 'react-native';
import {
  Container, Header, Content, Text, Spinner,
  Item, Input, Icon, Button, Toast,
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import { NavigationActions } from 'react-navigation';
import axios from 'axios';
import { SearchFiveUnitBar, ShowMore } from '../../component/common';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('ApplicationStore') // Inject some or all the stores!
@observer
export default class AddFiveRestaurant extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.category} FIVE 참여`,
    headerStyle: {
      backgroundColor: 'white',
      borderBottomWidth: 0,
    },
    headerTintColor: '#FA3F97',
    headerBackTitleStyle: {
      color: '#FA3F97',
    },
    headerTitleStyle: {
      color: 'black',
    },
    drawerLockMode: 'locked-closed',
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      category: this.props.navigation.state.params.category,
      klass: this.props.navigation.state.params.klass,
      page: 1,
      page_loading: false,
      no_more: true,
      documents: [],
      clicked: []
    };
  }

  addFive(document, index) {
    axios.get(`${ApiServer.KAKAO_GEO_API}?x=${document.x}&y=${document.y}&input_coord=WGS84`, {
      headers: {
        'Authorization': ApiServer.KAKAO_API_KEY,
      },
    }).then((response) => {
      axios.post(`${ApiServer.MY_PROFILE}/add_or_create_five?category=${this.state.klass.toLowerCase()}`, {
        zipcode: response.data.documents[0].road_address.zone_no,
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
    }).catch((error) => {
      Toast.show({
        text: JSON.stringify(error.response.data),
        position: 'bottom',
        duration: 1500,
      });
    });
  }

  askAddFive(document, index) {
    Alert.alert(
      'FIVE 선택 확인',
      `${document.place_name}을(를) ${this.state.category} FIVE로 선택하시겠어요?`,
      [
        {
          text: '아니요',
          style: 'cancel',
        },
        {
          text: '네',
          onPress: () => this.addFive(document, index),
        }
      ],
      { cancelable: true },
    );
  }

  onAddFiveSuccess(data, document, index) {
    const documentsBefore = [...this.state.documents];
    //documentsBefore.splice(index, 1);
    documentsBefore[index].clicked = true;
    this.setState({ documents: documentsBefore }, () => {
      Alert.alert(
        `${this.state.category} FIVE 선택됨`,
        `${document.place_name}이(가) ${this.state.category} FIVE로 선택되었습니다. 아직 ${5 - data.fives_count}개를 더 선택할 수 있어요!`,
        [
          {
            text: '그만 선택하기',
            onPress: () => {
              this.props.navigation.dispatch(
                NavigationActions.reset({
                  index: 0,
                  actions: [
                    NavigationActions.navigate({
                      routeName: 'Main',
                      params: {},
                    }),
                  ],
                }))
            },
          },
          {
            text: '더 선택하기',
            style: 'cancel',
          }
        ],
        { cancelable: true },
      );
    });
  }

  searchKakao(input_search) {
    this.setState({ loading: true });
    const config = {
      headers: {
        'Authorization': ApiServer.KAKAO_API_KEY,
      },
    };
    axios.get(`${ApiServer.KAKAO_API}?query=${input_search}&page=${this.state.page}&size=15&category_group_code=${Constant.KakaoApiCategory(this.state.klass.toLowerCase())}`, config)
      .then((response) => {
        console.log(response);
        this.setState({
          loading: false,
          documents: response.data.documents,
          no_more: response.data.meta.is_end,
          page_loading: false,
        });
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
          'Authorization': ApiServer.KAKAO_API_KEY,
        },
      };
      axios.get(`${ApiServer.KAKAO_API}?query=${this.state.input_search}&page=${this.state.page}&size=15&category_group_code=${Constant.KakaoApiCategory(this.state.klass.toLowerCase())}`, config)
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

  render() {
    const { container, preLoading } = BaseStyle;
    const { navigation } = this.props;

    return (
      <Container keyboardShouldPersistTaps={'always'}>
        <Header searchBar rounded style={{
          paddingTop: 0,
          height: 56,
        }}>
          <Item>
            <Icon name="ios-search"/>
            <Input
              placeholder="Search"
              autoCapitalize={'none'}
              autoCorrect={false}
              autoFocus={true}
              multiline={false}
              returnKeyType={'search'}
              onSubmitEditing={() => this.searchKakao(this.state.input_search)}
              onChangeText={(input_search) => this.setState({ input_search })}
            />
            <Icon name="ios-people"/>
          </Item>
        </Header>
        <Content>
          <FlatList
            data={this.state.documents}
            style={{
              paddingTop: 10,
            }}
            renderItem={({ item, index }) => (
              <SearchFiveUnitBar
                id={item.id}
                title={item.place_name}
                subtitle={item.address_name}
                clicked={item.clicked}
                onPress={() => this.askAddFive(item, index)}
                onPressImage={() => this.props.screenProps.modalNavigation.navigate('Map', {
                  lng: item.x,
                  lat: item.y,
                  title: item.place_name,
                })}
              />
            )}
            keyExtractor={item => 'search-five-list-' + item.id}
            ListFooterComponent={
              this.renderNextPageButton()
            }
          />
        </Content>
        {this.state.loading &&
        <View style={preLoading}>
          <Spinner size="large"/>
        </View>
        }
      </Container>
    );
  }
}
