import React, { Component } from 'react';
import {
  View, FlatList, TouchableOpacity
} from 'react-native';
import {
  Container, Header, Content, Text,
  Spinner, Button, Left, Body, Title,
  Right, ActionSheet,
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import {
  UserUnitRound, FivesBar, EmptyBox, TabIcon, NavBar, ElevenHeader,
} from '../../component/common';
import * as Images from '../../assets/images/Images';
import * as Constant from '../../config/Constant';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

import Icon from 'react-native-vector-icons/FontAwesome';

@inject('stores') @observer
export default class TabB extends Component {

  static navigationOptions = ({ navigation }) => ({
    tabBarLabel: '마이파이브',
    tabBarIcon: ({ tintColor }) => (
      <TabIcon
        tintColor={tintColor}
        imageGrey={require('../../assets/images/five_icon_grey.png')}
        imagePink={require('../../assets/images/five_icon_pink.png')}
      />
    ),
    header: null,
    ...Constant.FiveNavOptions,
  });

  constructor(props) {
    super(props);
    this.app = this.props.stores.app;
    this.server = this.props.stores.server;
    this.state = {
      loading: true, //실서비스에서는 로딩 true로
      refreshing: false,
      headerShow: true,
    };
  }

  componentDidMount() {
    this.server.profileIndex(async (res) => {
      await this.app.setMyProfile(res.data.user)
    }).then(() => {this.setState({ loading: false });});
  }

  _onRefresh() {
    this.setState({ refreshing: true }, () => {
      this.server.profileIndex((res) => {
        this.app.setMyProfile(res.data.user)
          .then(() => this.app.setCategories(res.data.categories));
      }).then(() => {
        this.setState({ refreshing: false });
      });
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
        title: '어떤 FIVE를 만들어 보시겠어요?',
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
    var currentOffset = e.nativeEvent.contentOffset.y;
    var headerShow = currentOffset < 50000;
    this.setState({ headerShow });
  }

  render() {
    const { preLoading } = BaseStyle;
    const { navigation } = this.props;
    const { my_profile } = this.app;

    return (
      <Container style={{ backgroundColor: '#fafafa' }}>
        <ElevenHeader
          custom
          headerShow={this.state.headerShow}
          rightButton
          rightAsImage
          buttonIcon={require('../../assets/images/bookmark_box.png')}
          onPressRight={() => navigation.navigate('ProfileWishIndex', { initialCategory: null })}
        />
          <FlatList
            data={this.app.categories}
            style={{paddingBottom: 16}}
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
            onScroll={(e) => {this.handleScroll(e)}}
            renderItem={({ item }) => (
              <FivesBar
                onPress={() => navigation.navigate('ProfileFiveIndex', {
                  category_chunk: item
                })}
                category={item.category}
                followers={item.followers_count}
                followees={item.followees_count}
                fives={item.fives}
                image={require('../../assets/images/five_void_grey.png')}
                fiveImage={Images.findImageOf(item.klass.toLowerCase())}
              />
            )}
            keyExtractor={item => 'five-category-list-' + item.klass}
            ListHeaderComponent={
              <Row style={{
                height: 280,
                alignItems: 'center',
                backgroundColor: '#ffffff',
              }}>
                <Col style={{ alignItems: 'center' }}>
                  <TouchableOpacity style={{ width: 130, height: 130}}
                                    onPress={() => navigation.navigate('Setting')}
                  >
                    <UserUnitRound
                      id={my_profile.id}
                      image_url={my_profile.image_medium_url}
                      onPress={() => navigation.navigate('Setting')}
                      barWidth={130}
                      barHeight={130}
                      borderRadius={65}
                      marginRight={0}
                    />
                    <View style={{
                      position:'absolute',
                      bottom:0,
                      right:0,
                      minWidth:32,
                      height:32,
                      borderRadius:16,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'white',
                    }}>
                      <Icon
                        name='cog'
                        style={{
                          fontSize: 28,
                          backgroundColor: 'transparent',
                          color: Constant.LightGrey,
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                  <Text style={{
                    textAlign: 'center',
                    fontFamily: 'montserrat',
                    fontSize: 26,
                    padding: 5,
                  }} large numberOfLines={1}>{my_profile.name}</Text>
                  <Text note style={{ width: 250, textAlign: 'center', padding: 3 }} numberOfLines={2}> {my_profile.introduce} </Text>
                </Col>
              </Row>
            }
          />
        { this.app.categories.length > 0 ?
          null
          : <EmptyBox
            barWidth={Constant.deviceWidth}
            onPress={() => this.onClickAdd()}
            message={`아직 FIVE를 하나도 선택하지 않았어요. ${'\n'}여기를 눌러서 음악 또는 책을 추가해 보세요!`}
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
