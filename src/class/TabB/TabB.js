import React, { Component } from 'react';
import {
  View, FlatList, TouchableOpacity
} from 'react-native';
import {
  Container, Header, Content, Text,
  Spinner, Button, Icon, Left, Body, Title,
  Right, ActionSheet,
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import {
  UserUnitRound, FivesBar, ElevenHeader, EmptyBox, TabIcon,
} from '../../component/common';
import axios from 'axios';
import * as Images from '../../assets/images/Images';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('ApplicationStore') // Inject some or all the stores!
@observer
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
    this.state = {
      loading: true, //실서비스에서는 로딩 true로
      refreshing: false,
      header: {
        headers: {
          'X-User-Email': this.props.ApplicationStore.email,
          'X-User-Token': this.props.ApplicationStore.token,
        },
      },
      categories: [],
      headerShow: true,
    };
  }

  componentDidMount() {
    this.apiCall();
  }

  async apiCall() {
    await axios.get(`${ApiServer.MY_PROFILE}`, this.state.header)
      .then((response) => {
        this.props.ApplicationStore.setMyProfile(response.data.user);
        this.setState({
          loading: false, //실서비스에서는 로딩 true로
          categories: response.data.categories,
        });
      })
      .catch((error) => {
        console.log(JSON.stringify(error.response));
      });
  }

  _onRefresh() {
    this.setState({refreshing: true});
    this.apiCall().then(() => {
      this.setState({refreshing: false});
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

    const BUTTONS = [ '음악', '취소' ];
    const pages = [ 'ProfileFiveAddMusic' ];
    const category_koreans = [ '음악' ];
    const categories = [ 'music' ];
    const klasses = [ 'Music' ];
    const CANCEL_INDEX = 1;

    ActionSheet.show(
      {
        options: BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
        title: '+ Five or Clip',
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
    var currentOffset = e.nativeEvent.contentOffset.y;
    var headerShow = currentOffset < 100;
    this.setState({ headerShow });
  }

  render() {
    const { preLoading } = BaseStyle;
    const { navigation } = this.props;
    const { my_profile } = this.props.ApplicationStore;

    return (
      <Container style={{ backgroundColor: '#FFFFFF' }}>
        <ElevenHeader
          headerShow={this.state.headerShow}
          title={'프로필'}
          custom
          rightButton
          rightAsImage
          buttonIcon={require('../../assets/images/bookmark_icon_pink.png')}
          onPressRight={() => navigation.navigate('ProfileWishIndex')} />
          <FlatList
            data={this.state.categories}
            style={{paddingBottom: 15}}
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
            onScroll={(e) => {this.handleScroll(e)}}
            renderItem={({ item }) => (
              <FivesBar
                onPress={() => navigation.navigate('ProfileFiveIndex', { category: item.category })}
                category={item.category}
                followers={item.followers_count}
                followees={item.followees_count}
                fives={item.fives}
                image={require('../../assets/images/five_void_grey.png')}
              />
            )}
            keyExtractor={item => 'five-category-list-' + item.klass}
            ListHeaderComponent={
              <Row style={{
                height: 250,
                alignItems: 'center',
              }}>
                <Col style={{ alignItems: 'center' }}>
                  <TouchableOpacity style={{ width: 140, height: 130}}
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
                      bottom:10,
                      right:10,
                      minWidth:40,
                      height:40,
                      borderRadius:20,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#FFF',
                    }}>
                      <Icon
                        name="md-create"
                        style={{
                          fontSize: 25,
                          color: Constant.FiveColor,
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                  <Text style={{
                    textAlign: 'center',
                    fontSize: 25,
                  }} large numberOfLines={1}>{my_profile.name}</Text>
                  <Text note style={{ width: 250, textAlign: 'center' }} numberOfLines={2}>{my_profile.introduce}</Text>
                </Col>
              </Row>
            }
          />
        { this.state.categories.length > 0 ?
          null
          : <EmptyBox
            barWidth={Constant.deviceWidth - 20}
            onPress={() => this.onClickAdd()}
            message={`아직 담은 FIVE가 없으시네요. ${'\n'}여기를 눌러서 카테고리를 추가하세요`}
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
