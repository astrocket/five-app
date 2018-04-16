import React, { Component } from 'react';
import {
  View, Image, TouchableOpacity, FlatList, RefreshControl, Dimensions, ScrollView,
} from 'react-native';
import {
  Container, Header, Content, Text, Spinner,
  Card, CardItem, Thumbnail, Button, Icon, Left,
  Body, Right, H1, Toast, ListItem, ActionSheet, Fab, DeckSwiper,
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import {
  FiveUnitBar, FiveUnitFull, NavBar,
} from '../../component/common';
import { FollowSmallButton } from '../../component/common';
import axios from 'axios';
import { NavigationActions } from 'react-navigation';
import * as Images from '../../assets/images/Images';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

import SwipeCards from '../Five/SwipeCards.js';

@inject('ApplicationStore') // Inject some or all the stores!
@observer

export default class ProfileFiveIndex extends Component {

  static navigationOptions = ({ navigation }) => ({
/*    headerRight: (
      navigation.state.params.navLoading ?
        null :
        <View style={BaseStyle.headerDoubleIconsContainer}>
          <Button onPress={navigation.state.params.openShareActionSheet} transparent>
            <Icon
              name="ios-share-outline"
              style={{
                fontSize: 25,
                color: Constant.FiveColor,
              }}
            />
          </Button>
        </View>
    ),*/
   header: null
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
      category: this.props.navigation.state.params.category,
      flip: false,
      clicked: false,
      fives: [],
      followers_count: '',
      followees_count: '',
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({
      openShareActionSheet: () => this.openShareActionSheet(),
      toggleFollow: () => this.toggleFollow(),
    });
    this.apiCall();
  }

  async apiCall() {
    await axios.get(`${ApiServer.MY_PROFILE}/fives?category=${this.state.category}`, this.state.header)
      .then((response) => {
        this.setState({
          loading: false,
          klass: response.data.klass,
          category_korean: response.data.category_korean,
          fives: response.data.fives,
          followers_count: response.data.followers_count,
          followees_count: response.data.followees_count,
        });
      })
      .catch((error) => {
        console.log('에러 : ' + error.response);
      });
  }

  _onRefresh() {
    this.setState({refreshing: true});
    this.apiCall().then(() => {
      this.setState({refreshing: false});
    });
  }

  openShareActionSheet() {
    const BUTTONS = [ '카카오톡 공유하기', 'Cancel' ];
    const CANCEL_INDEX = 1;

    ActionSheet.show(
      {
        options: BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
      },
      buttonIndex => this.shareAction(BUTTONS[buttonIndex]),
    );
  }

  shareAction(value) {
    Toast.show({
      text: value,
      position: 'bottom',
      duration: 1500
    })
  }

  render() {
    const { container, preLoading, rowFlexCenterCenter } = BaseStyle;
    const { navigation } = this.props;
    const { my_profile } = this.props.ApplicationStore;

    /* const cards = [
          {
            text: 'Card One',
            name: 'One',
            image: require('../../assets/images/five_void.png'),
          },
          {
            text: 'Card Two',
            name: '34',
            image: require('../../assets/images/five_void.png'),
          },
        ]; */ // 덱 스와이퍼 카드 데이터

    return (
      <Container>
        <NavBar
          leftButton
          leftAsImage
          leftIcon={require('../../assets/images/back_icon_pink.png')}
          onPressLeft={() => navigation.goBack()}
          rightButton
          rightAsImage
          rightIcon={require('../../assets/images/pencil_icon_pink.png')}
          onPressRight={() => navigation.navigate('ProfileFiveEdit', {
            category: this.state.category,
            category_korean: this.state.category_korean,
            klass: this.state.klass,
          })}
          headerText=""
        />
        <Content refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }>
          <View>
            <Col style={{ backgroundColor: 'white', marginTop: 10, marginBottom: 5, justifyContent: 'center' }}>
              <View style={rowFlexCenterCenter}>
                <Text style={{ color: Constant.GreyColor, fontFamily: 'montserrat', fontSize: 18, fontWeight: '600' }}>{my_profile.name}</Text>
                <Text style={{ color: Constant.GreyColor, fontSize: 18, fontWeight: '300' }}>의</Text>
              </View>
              <View style={rowFlexCenterCenter}>
                <Text style={{ color: 'black', fontSize: 28, fontWeight: '900' }}>{this.state.category_korean} </Text>
                <Text style={{ color: 'black', fontSize: 28, fontWeight: '300' }}>파이브</Text>
              </View>
              <View style={rowFlexCenterCenter}>
                <TouchableOpacity transparent style={{
                  flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', margin: 10
                }} onPress={() => navigation.navigate('ProfileFollowerIndex', { category: this.state.category })}>
                  <Text style={{ fontFamily: 'montserrat', fontSize: 17, fontWeight: '900'}} >{Number(this.state.followers_count).toLocaleString()}</Text>
                  <Text style={{ color: Constant.GreyColor, fontSize: 17, fontWeight: '300'}} >{'  팔로워 '}</Text>
                </TouchableOpacity>
                <TouchableOpacity transparent style={{
                  flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: 10
                }} onPress={() => navigation.navigate('ProfileFolloweeIndex', { category: this.state.category })}>
                  <Text style={{ fontFamily: 'montserrat', fontSize: 17, fontWeight: '900'}} >{Number(this.state.followees_count).toLocaleString()}</Text>
                  <Text style={{ color: Constant.GreyColor, fontSize: 17, fontWeight: '300'}}>{'  팔로잉'}</Text>
                </TouchableOpacity>
              </View>
            </Col>
          </View>
          <Row style={{ width: Constant.deviceWidth, height: 400, alignItems: 'center', justifyContent: 'center', backgroundColor: 'red', borderRadius: 24 }}>
            <Col style={{ flex: 1, width: Constant.deviceWidth, height: 380, borderRadius: 24, backgroundColor: 'white' }}>
              <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  scrollEventThrottle={10}
                  pagingEnabled={true}
                  renderItem={({ item }) => (

                       <FiveUnitFull
                          multiple
                          id={item.id}
                          subtitle={item.subtitle}
                          title={item.title}
                          friends_info={`FIVE ${item.five_users_count}`}
                          image_url={item.image_large_url}
                          onPress={() => navigation.navigate('FiveShow', {
                            category: this.state.category,
                            title: item.title,
                            id: item.id,
                            navLoading: true,
                          })}
                          borderRadius={20}
                          marginRight={32}
                          cardCut={80}
                        />

                  )}
              />
            </Col>
          </Row>
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



/* <DeckSwiper
            dataSource={cards}
            renderItem={item =>
              <Card style={{ elevation: 10 }}>
                <CardItem>
                  <Left>
                    <Thumbnail source={item.image} />
                    <Body>
                      <Text>{item.text}</Text>
                      <Text note>NativeBase</Text>
                    </Body>
                  </Left>
                </CardItem>
                <CardItem cardBody>
                  <Image style={{ height: 300, flex: 1 }} source={item.image} />
                </CardItem>
                <CardItem>
                  <Icon name="heart" style={{ color: '#ED4A6A' }} />
                  <Text>{item.name}</Text>
                </CardItem>
              </Card>
            }
          />

          */

