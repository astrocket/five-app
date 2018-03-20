import React, { Component } from 'react';
import {
  View, FlatList, RefreshControl, TouchableOpacity
} from 'react-native';
import {
  Container, Header, Content, Text,
  Spinner, Button, Icon, Left, Body, Title,
  Right, Toast
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import {
  UserUnitRound, FivesBar, ElevenHeader,
} from '../../component/common';
import axios from 'axios';
import * as Images from '../../assets/images/Images';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import PopupDialog from 'react-native-popup-dialog';
import MyFiveRestaurantModal from '../Restaurant/MyFiveRestaurantModal';
import { observer, inject } from 'mobx-react/native';

@inject('ApplicationStore') // Inject some or all the stores!
@observer
export default class TabB extends Component {

  static navigationOptions = ({ navigation }) => ({
    tabBarLabel: '마이파이브',
    tabBarIcon: ({ tintColor }) => (
      <Icon
        name="logo-apple"
        style={{
          fontSize: 25,
          color: tintColor,
        }}
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
      categories: [],
      headerShow: true,
    };
  }

  componentDidMount() {
    this.apiCall();
  }

  async apiCall() {
    const config = {
      headers: {
        'X-User-Email': this.props.ApplicationStore.email,
        'X-User-Token': this.props.ApplicationStore.token,
      },
    };
    await axios.get(`${ApiServer.MY_PROFILE}`, config)
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
          title={'프로필'} custom rightButton onPressRight={() => navigation.navigate('ProfileWishIndex')} buttonIcon={"md-attach"}>
          <Left/>
          <Body>
          <Title>{'프로필'}</Title>
          </Body>
          <Right>
            <Button onPress={() => navigation.navigate('ProfileWishIndex')} transparent>
              <Icon
                name="md-attach"
                style={{
                  fontSize: 25,
                  color: Constant.FiveColor,
                }}
              />
            </Button>
          </Right>
        </ElevenHeader>
        <FlatList
          data={this.state.categories}
          style={{paddingBottom: 15}}
          refreshing={this.state.refreshing}
          onRefresh={this._onRefresh.bind(this)}
          onScroll={(e) => {this.handleScroll(e)}}
          renderItem={({ item }) => (
            <FivesBar
              onPress={() => navigation.navigate('ProfileFiveIndex', { five_category: item.klass.toLowerCase() })}
              category={item.category}
              followers={item.followers_count}
              followees={item.followees_count}
              fives={item.fives}
              image={Images.findImageOf(item.klass.toLowerCase())}
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
                                  onPress={() => navigation.navigate('Setting', {
                                    categories: this.state.categories
                                  })}
                >
                  <UserUnitRound
                    id={my_profile.id}
                    image_url={my_profile.image_medium_url}
                    onPress={() => navigation.navigate('Setting', {
                      categories: this.state.categories
                    })}
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
        {this.state.loading &&
        <View style={preLoading}>
          <Spinner size="large"/>
        </View>
        }
      </Container>
    );
  }
}
