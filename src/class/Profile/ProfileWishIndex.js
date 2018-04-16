import React, { Component } from 'react';
import {
  View, FlatList, TouchableOpacity,
} from 'react-native';
import {
  Container, Spinner, Tabs, Tab, ScrollableTab, Button, Text, TabHeading, Header,
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import axios from 'axios';
import { EmptyBox, NavBar } from '../../component/common';
import ProfileWishShow from './ProfileWishShow';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('ApplicationStore') // Inject some or all the stores!
@observer
export default class ProfileWishIndex extends Component {

  static navigationOptions = ({ navigation }) => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: true, //실서비스에서는 로딩 true로
      headerShow: true,
      header: {
        headers: {
          'X-User-Email': this.props.ApplicationStore.email,
          'X-User-Token': this.props.ApplicationStore.token,
        },
      },
      categories: [],
    };
  }

  componentDidMount() {
    this.apiCall();
  }

  apiCall() {
    axios.get(`${ApiServer.MY_PROFILE}/wishes`, this.state.header)
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
    const currentOffset = e.nativeEvent.contentOffset.y;
    const headerShow = currentOffset < 100;
    this.setState({ headerShow });
  }

  renderCategoryTabs(onScroll) {
    const { navigation } = this.props;
    return this.state.categories.map(function (each_category, i) {
      const { klass, category, category_korean, wishes } = each_category;
      return (
        <Tab key={i} heading={<TabHeading/>}>
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

  renderTabButtons(goToPage) {
    const { flexCenterCenter } = BaseStyle;
    return (
      <View style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        height: 24,
      }}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{
            height: 24,
          }}
          data={this.state.categories}
          renderItem={({ item, index }) => (
            <TouchableOpacity key={index} onPress={() => goToPage(index)}
                              style={[ flexCenterCenter, {
                                height: 24,
                                width: null,
                                paddingRight: 16,
                              } ]}>
              <Text normal style={{
                        color: '#333333',
                        fontSize: 22,
                        fontWeight: '900'
                      }}>
                  {item.category_korean}
                </Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => 'tabs-' + item.category}
        />
      </View>
    );
  }

  render() {
    const { container, preLoading } = BaseStyle;
    const { navigation } = this.props;

    return (
      <Container style={{ backgroundColor: '#FFFFFF' }}>
        <NavBar
          leftButton
          leftAsImage
          leftIcon={require('../../assets/images/back_icon_pink.png')}
          onPressLeft={() => navigation.goBack()}
          headerText="내 보관함"
        />
        <Header style={{
          backgroundColor: '#FFFFFF',
          paddingLeft: 16,
          paddingRight: 16,
          borderBottomWidth: 0,
          height: 46,
        }}>
          {this.renderTabButtons((page) => this.tabView.goToPage(page))}
        </Header>
        {this.state.categories.length > 0 ?
          <Tabs locked initialPage={0} ref={(tabView) => {
            this.tabView = tabView;
          }} tabBarUnderlineStyle={{ opacity: 0 }} tabBarPosition={'overlayTop'}
                renderTabBar={() => <ScrollableTab/>}>
            {this.renderCategoryTabs((e) => this.handleScroll(e))}
          </Tabs>
          : <EmptyBox
            barWidth={Constant.deviceWidth - 20}
            message={`아직 보관한 아이템이 하나도 없어요. ${'\n'}나의 FIVE가 될 아이템을 찾아보세요!`}
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
