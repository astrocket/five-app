import React, { Component } from 'react';
import {
  View
} from 'react-native';
import {
  Container, Spinner, Tabs, Tab, ScrollableTab, Button, Text, Header,
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import { EmptyBox, NavBar } from '../../component/common';
import ProfileWishShow from './ProfileWishShow';
import * as Constant from '../../config/Constant';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('stores') @observer
export default class ProfileWishIndex extends Component {

  static navigationOptions = ({ navigation }) => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.app = this.props.stores.app;
    this.server = this.props.stores.server;
    this.state = {
      loading: true, //실서비스에서는 로딩 true로
      headerShow: true,
      categories: [],
      initialPage: 0,
      initialCategory: (typeof this.props.navigation.state.params.initialCategory === 'undefined') ? null : this.props.navigation.state.params.initialCategory
    };
  }

  componentDidMount() {
    this.server.profileWishes((data) => this.setState(data))
      .then(() => {
        this.setState({ loading: false }, () => {
          if (this.state.initialCategory !== null) {
            this.moveToPage();
          }
        })
      });
  }

  moveToPage() {
    this.state.categories.map ((each_category,i) => {
      const { category } = each_category;
      if (this.state.initialCategory === category) {
        this.tabView.goToPage(i);
      }
    });
  }

  handleScroll(e) {
    const currentOffset = e.nativeEvent.contentOffset.y;
    const headerShow = currentOffset < 0;
    this.setState({ headerShow });
  }

  renderCategoryTabs(onScroll) {
    const { navigation } = this.props;

    return this.state.categories.map ((each_category, i) => {
      const { klass, category, category_korean, wishes } = each_category;

      return (
        <Tab key={i} heading={category_korean} tabStyle={{
          backgroundColor: 'transparent',
        }} activeTabStyle={{
          backgroundColor: 'transparent'
        }} textStyle={{
          color: Constant.LightGrey,
          fontSize: 20,
          fontWeight: 'bold'
        }} activeTextStyle={{
          color: Constant.FiveColor,
          fontSize: 20,
          fontWeight: 'bold',
        }}>
          <ProfileWishShow
            klass={klass}
            category={category}
            category_korean={category_korean}
            wishes={wishes}
            navigation={navigation}
            onScroll={onScroll}
          />
        </Tab>
      );
    });
  }

  render() {
    const { container, preLoading } = BaseStyle;
    const { navigation } = this.props;

    return (
      <Container style={{ backgroundColor: '#FFFFFF' }}>
        <NavBar
          hasTabs
          leftButton
          leftAsImage
          leftIcon={require('../../assets/images/back_icon_pink.png')}
          onPressLeft={() => navigation.goBack()}
          headerText="내 보관함"
        />
        {this.state.categories.length > 0 ?
          <Tabs locked initialPage={this.state.initialPage} ref={(tabView) => {
            this.tabView = tabView;
          }} renderTabBar={() => <ScrollableTab tabsContainerStyle={{ 
                                                                      justifyContent: 'flex-start', 
                                                                      flexWrap: 'wrap', 
                                                                      backgroundColor: 'transparent',
                                                                    }}/>} 
                                                tabBarUnderlineStyle={{
                                                                      backgroundColor: 'transparent',
                                                                      borderBottomColor: '#FFF',
                                                                      elevation: 0,
                                                                    }}>
            {this.renderCategoryTabs((e) => this.handleScroll(e))}
          </Tabs>
          : <EmptyBox
            barWidth={Constant.deviceWidth}
            message={`아직 보관한 아이템이 하나도 없어요. ${'\n'}북마크를 누르면 여기에 보관할 수 있어요!`}
            barHeight={100}
            borderRadius={10}
            marginRight={0}
          />
        }
        {this.state.loading &&
        <View style={preLoading}>
          <Spinner size="large"/>
        </View>
        }
      </Container>
    );
  }
}
