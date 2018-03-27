import React, { Component } from 'react';
import {
  View, Image,
} from 'react-native';
import {
  Container, Header, Content, Text, Spinner, Button, List, ListItem, Icon, Tabs, Tab, TabHeading,
  ScrollableTab, ActionSheet,
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import { ImageCon } from '../../component/common';
import axios from 'axios';
import HomeIndex from './HomeIndex';
import FiveIndex from '../Five/FiveIndex';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('ApplicationStore') // Inject some or all the stores!
@observer

export default class TabA extends Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    header: null,
    tabBarLabel: '홈',
    tabBarIcon: ({ tintColor }) => (
      <Icon
        name="ios-home"
        style={{
          fontSize: 25,
          color: tintColor,
        }}
      />
    ),
    ...Constant.FiveNavOptions,
  });

  state = {
    loading: true,
    categories: [],
    headerShow: true,
  };

  componentDidMount() {
    this.apiCall();
  }

  apiCall() {
    const config = {
      headers: {
        'X-User-Email': this.props.ApplicationStore.email,
        'X-User-Token': this.props.ApplicationStore.token,
      },
    };
    axios.get(`${ApiServer.MY_PROFILE}/categories`, config)
      .then((response) => {
        this.setState({
          loading: false,
          categories: response.data.categories,
        });
      })
      .catch((error) => {
        console.log('에러 : ' + error.response);
      });
  }

  onClickAdd() {
    const { navigation } = this.props;
/*    const BUTTONS = [ '요즘 좋은 음악', '즐겨 찾는 맛집', '재미 있는 책', '취소' ];
    const pages = [ 'ProfileFiveAddMusic', 'ProfileFiveAddRestaurant', 'ProfileFiveAddBook' ];
    const category_koreans = [ '음악', '맛집', ' 책' ];
    const categories = [ 'music', 'restaurant', 'book'];
    const klasses = ['Music', 'Restaurant', 'Book'];
    const CANCEL_INDEX = 3;*/
    const BUTTONS = [ '요즘 좋은 음악', '재미 있는 책', '취소' ];
    const pages = [ 'ProfileFiveAddMusic', 'ProfileFiveAddBook' ];
    const category_koreans = [ '음악', ' 책' ];
    const categories = [ 'music', 'book'];
    const klasses = ['Music', 'Book'];
    const CANCEL_INDEX = 2;


    ActionSheet.show(
      {
        options: BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
        title: '나의 FIVE에 아이템 추가하기',
      },
      buttonIndex => {
        navigation.navigate(pages[ buttonIndex ], {
          klass: klasses[ buttonIndex ],
          category_korean: category_koreans[ buttonIndex ],
          category: categories[ buttonIndex ],
        });
      },
    );
  }

  handleScroll(e) {
    const currentOffset = e.nativeEvent.contentOffset.y;
    const headerShow = currentOffset < 100;
    this.setState({ headerShow });
  }

  renderCategoryTabs(onScroll) {
    const { navigation } = this.props;

    return this.state.categories.map(function (chunk, i) {
      const { category, category_korean } = chunk;
      return (
        <Tab key={i} heading={category_korean} activeTextStyle={{ color: Constant.FiveColor }}>
          <FiveIndex category={category} navigation={navigation} onScroll={onScroll}/>
        </Tab>
      )
    });
  }

  render() {
    const { container, preLoading } = BaseStyle;
    const { navigation } = this.props;

    return (
      <Container>
        {this.state.headerShow ?
          <Header hasTabs style={{
            height: Constant.globalPaddingTop + 35 + 40,
            paddingRight: 0,
          }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              flex: 1,
              marginTop: Constant.globalPaddingTop,
            }}>
              <View style={{
                width: 130,
              }}>
                <Text xlarge>{'Myfive'}</Text>
                <View style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                }}>
                  <Text micro grey>β</Text>
                </View>
              </View>
              <View>
                <Button onPress={() => this.onClickAdd()} transparent style={{ marginRight: 10 }}>
                  <ImageCon
                    image={require('../../assets/images/add_icon_pink.png')}
                  />
                </Button>
              </View>
            </View>
          </Header>
          : <View style={{
            paddingTop: Constant.globalPaddingTop,
            backgroundColor: '#F8F8F8',
          }}></View>
        }
        <Tabs locked tabBarUnderlineStyle={{ backgroundColor: Constant.FiveColor, }}>
          <Tab heading="홈" activeTextStyle={{ color: Constant.FiveColor }}>
            <HomeIndex navigation={navigation} onScroll={(e) => this.handleScroll(e)}/>
          </Tab>
          {this.renderCategoryTabs((e) => this.handleScroll(e))}
        </Tabs>
        {this.state.loading &&
        <View style={preLoading}>
          <Spinner size="large"/>
        </View>
        }
      </Container>
    );
  }

}