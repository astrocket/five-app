import React, { Component } from 'react';
import {
  View, Platform,
} from 'react-native';
import {
  Container, Header, Content, Text, Spinner, Button, List, ListItem, Icon, Tabs, Tab, TabHeading,
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import axios from 'axios';
import HomeIndex from './HomeIndex';
import RestaurantIndex from '../Restaurant/RestaurantIndex';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('ApplicationStore') // Inject some or all the stores!
@observer

export default class TabA extends Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    header: null
    ,
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
    axios.get(`${ApiServer.MY_PROFILE}/wishes?category=restaurant`, config)
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

  handleScroll(e) {
    var currentOffset = e.nativeEvent.contentOffset.y;
    var headerShow = currentOffset <= this.offset;
    this.offset = currentOffset;
    this.props.navigation.setParams({ headerShow });
    this.setState({ headerShow });
  }

  render() {
    const { container, preLoading } = BaseStyle;
    const { navigation } = this.props;

    return (
      <Container>
        {this.state.headerShow ?
          <Header hasTabs>
            <View style={{
              justifyContent: 'center',
              alignItems: 'flex-start',
              flex: 1,
            }}>
              <View style={{
                width: 130,
                margin: 5,
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
            </View>
          </Header>
          : null
        }
        <Tabs locked tabBarUnderlineStyle={{
          backgroundColor: Constant.FiveColor,
        }}>
          <Tab heading="홈" activeTextStyle={{
            color: Constant.FiveColor,
          }}>
            <HomeIndex navigation={navigation} onScroll={(e) => this.handleScroll(e)}/>
          </Tab>
          <Tab heading="맛집" activeTextStyle={{
            color: Constant.FiveColor,
          }}>
            <RestaurantIndex navigation={navigation} onScroll={(e) => this.handleScroll(e)}/>
          </Tab>
          <Tab heading="음악" activeTextStyle={{
            color: Constant.FiveColor,
          }}>
            <Text>hi</Text>
          </Tab>
          <Tab heading="책" activeTextStyle={{
            color: Constant.FiveColor,
          }}>
            <Text>hi</Text>
          </Tab>
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