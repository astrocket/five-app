import React, { Component } from 'react';
import {
  View, FlatList, TouchableOpacity, StyleSheet,
} from 'react-native';
import {
  Container, Header, Content, Text, Spinner, Button, List, ListItem, Tabs, Tab, TabHeading,
  ScrollableTab, ActionSheet,
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import { ImageCon, TabIcon } from '../../component/common';
import axios from 'axios';
import HomeIndex from './HomeIndex';
import FiveIndex from '../Five/FiveIndex';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

import Icon from 'react-native-vector-icons/FontAwesome';

@inject('ApplicationStore') // Inject some or all the stores!
@observer

export default class TabA extends Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    header: null,
    tabBarLabel: '홈',
    tabBarIcon: ({ tintColor }) => (
      <TabIcon
        tintColor={tintColor}
        imageGrey={require('../../assets/images/home_icon_grey.png')}
        imagePink={require('../../assets/images/home_icon_pink.png')}
      />
    ),
    ...Constant.FiveNavOptions,
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      categories: [],
      headerShow: true,
    };
  }

  componentDidMount() {
    this.apiCall();
  }

  apiCall() {
    this.props.ApplicationStore.updateCategories().then(() => {
      this.setState({ loading: false })
    });
  }

  onClickAdd() {
    const { navigation } = this.props;
    const BUTTONS = [ '음악', '책', '취소' ];
    const category_koreans = [ '음악', '책' ];
    const pages = [ 'SearchFive', 'SearchFive'];
    const categories = [ 'music', 'book' ];
    const klasses = [ 'Music', 'Book' ];
    const CANCEL_INDEX = 2;

    ActionSheet.show(
      {
        options: BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
        title: '+ FIVE',
      },
      buttonIndex => {
        navigation.navigate(`${pages[ buttonIndex ]}`, {
          klass: klasses[ buttonIndex ],
          category_korean: category_koreans[ buttonIndex ],
          category: categories[ buttonIndex ],
        });
      },
    );
  }

  handleScroll(e) {
    const currentOffset = e.nativeEvent.contentOffset.y;
    const headerShow = currentOffset < 30;
    this.setState({ headerShow });
  }

  renderCategoryTabs(onScroll) {
    const { navigation } = this.props;

    return this.props.ApplicationStore.categories.map(function (chunk, i) {
      const { category, category_korean } = chunk;
      return (
        <Tab key={i} heading={<TabHeading/>}>
          <FiveIndex category={category} navigation={navigation} onScroll={onScroll}/>
        </Tab>
      );
    });
  }

  renderTabButtons(goToPage) {
    const { flexCenterCenter }= BaseStyle;
    return (
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 56}}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{
            height: 56,
          }}
          data={this.props.ApplicationStore.categories}
          renderItem={({ item, index }) => (
            <TouchableOpacity 
              key={index + 1} 
              transparent onPress={() => goToPage(index + 1)} 
              style={[flexCenterCenter,{ height: 56, width: null, paddingRight: 16 }]}
              >
              <Text style={styles.cateTab}>{item.category_korean}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => 'tabs-' + item.category}
          ListHeaderComponent={
            <TouchableOpacity transparent onPress={() => goToPage(0)} style={[flexCenterCenter,{ height: 56, width: null, paddingRight: 20 }]}>
              <Text style={styles.cateTab}>홈</Text>
            </TouchableOpacity>
          }
        />
        <View style={{
          height: 56,
        }}>
          <TouchableOpacity onPress={() => this.onClickAdd()} style={[flexCenterCenter,{ height: 56, width: null, paddingLeft: 16 }]}>
          <Icon
            name='plus-circle'
            style={{
            fontSize: 32,
            color: Constant.FiveColor,
            }}
          />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  render() {
    const { container, preLoading } = BaseStyle;
    const { navigation } = this.props;

    return (
      <Container>
        {this.state.headerShow ?
          <Header style={{
            paddingTop: Constant.globalPaddingTop + 10,
            height: Constant.globalPaddingTop + 10 + 72 + 56,
            paddingLeft: 24,
            paddingRight: 24,
            backgroundColor: '#FFF',
            borderBottomWidth: 0
          }}>
            <View style={{
              flex: 1,
              flexDirection: 'column',
            }}>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                flex: 1,
                marginTop: Constant.globalPaddingTop,
              }}>
                <View style={{
                  justifyContent: 'flex-end',
                  alignItems: 'flex-start'
                }}>
                  <Text style={styles.mainTitle}>{'Home'}</Text>
                  <Text style={{ fontFamily: 'montserrat', fontSize: 12, color: Constant.LightGrey }}>{''}</Text>
                </View>
              </View>
              {this.renderTabButtons((page) => this.tabView.goToPage(page))}
            </View>
          </Header>
          : <Header style={{
            paddingTop: Constant.globalPaddingTop,
            paddingLeft: 24,
            paddingRight: 24,
            height: 56 + Constant.globalPaddingTop,
            backgroundColor: '#FFF',
            borderBottomWidth: 0,
          }}>
            {this.renderTabButtons((page) => this.tabView.goToPage(page))}
          </Header>
        }
        <Tabs locked initialPage={0} ref={(tabView) => {
          this.tabView = tabView;
        }} tabBarUnderlineStyle={{ opacity: 1 }} tabBarPosition={'overlayTop'} 
              renderTabBar={() => <ScrollableTab/>}>
          <Tab heading={<TabHeading/>}>
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

const styles = StyleSheet.create({
  mainTitle: {
    color: Constant.LightGrey,
    fontSize: 32,
    fontWeight: '900',
    fontFamily: "montserrat"
  },
  cateTab: {
    color: Constant.LightGrey,
    fontSize: 24,
    fontWeight: '900',
  },
});