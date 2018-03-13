import React, { Component } from 'react';
import {
  View, Platform,
} from 'react-native';
import {
  Container, Header, Content, Text, Spinner, Button, List, ListItem, Icon, Tabs, Tab, TabHeading,
  ScrollableTab, ActionSheet,
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import axios from 'axios';
import HomeIndex from './HomeIndex';
import RestaurantIndex from '../Restaurant/RestaurantIndex';
import MusicIndex from '../Music/MusicIndex';
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
    var BUTTONS = ['맛집 추가', '음악 추가', '책 추가', '취소'];
    var pages = ['ProfileFiveAddRestaurant', 'ProfileFiveAddMusic', 'ProfileFiveAddBook'];
    var klasses = ['restaurant', 'music', 'book'];
    var categories = ['맛집', '음악',' 책'];
    var CANCEL_INDEX = 3;

    ActionSheet.show(
      {
        options: BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
        title: "새로운 파이브 시작하기"
      },
      buttonIndex => {
        navigation.navigate(pages[buttonIndex], {klass: klasses[buttonIndex],category: categories[buttonIndex] })
      }
    )
  }

  handleScroll(e) {
    var currentOffset = e.nativeEvent.contentOffset.y;
    var headerShow = currentOffset < 100;
    this.setState({ headerShow });
  }

  renderCategoryTabs(onScroll) {
    const { navigation } = this.props;
    return this.state.categories.map(function(category, i) {
      switch (category.klass.toLowerCase()) {
        case 'restaurant':
          return (
            <Tab key={i} heading="맛집" activeTextStyle={{
                  color: Constant.FiveColor,
                }}>
              <RestaurantIndex navigation={navigation} onScroll={onScroll}/>
            </Tab>
          );
        case 'music':
          return (
            <Tab key={i} heading="음악" activeTextStyle={{
              color: Constant.FiveColor,
            }}>
              <MusicIndex navigation={navigation} onScroll={onScroll}/>
            </Tab>
          );
      }
    });
  }

  render() {
    const { container, preLoading } = BaseStyle;
    const { navigation } = this.props;

    return (
      <Container>
        {this.state.headerShow ?
          <Header hasTabs style={{ height: Constant.globalPaddingTop + 35 + 40, paddingRight: 0 }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              flex: 1,
              marginTop: Constant.globalPaddingTop + 25,
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
                <Button onPress={() => this.onClickAdd()} transparent>
                  <Icon
                    name="md-add-circle"
                    style={{
                      fontSize: 25,
                      color: Constant.FiveColor,
                    }}
                  />
                </Button>
              </View>
            </View>
          </Header>
          : <View style={{
            paddingTop: Platform.OS === 'ios' ? 20 : 0,
            backgroundColor: '#F8F8F8',
          }}></View>
        }
        <Tabs locked tabBarUnderlineStyle={{
          backgroundColor: Constant.FiveColor,
        }}>
          <Tab heading="홈" activeTextStyle={{
            color: Constant.FiveColor,
          }}>
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