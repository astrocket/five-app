import React, { Component } from 'react';
import {
  View, Image, Alert,
} from 'react-native';
import {
  Container, Header, Content, Text,
  Spinner, Card, CardItem, Thumbnail,
  Button, Icon, Left, Body,
  Right, Segment, H1, H3,
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import {
  FoodUnitRound, UserUnitRound, SmallButton, FollowerInfo, EmptyBox,
} from '../../component/common';
import FoodShow from '../Food/FoodShow';
import axios from 'axios';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import ApplicationStore from '../../mobx/ApplicationStore';
import PopupDialog from 'react-native-popup-dialog';

export default class TabB extends Component {

  static navigationOptions = ({ navigation }) => ({
    tabBarLabel: '5',
    tabBarIcon: ({ tintColor }) => (
      <Icon
        name="logo-apple"
        style={{
          fontSize: 25,
          color: tintColor,
        }}
      />
    ),
    title: 'MY FIVE 맛집',
    headerRight: (
      <Button onPress={() => navigation.navigate('Invitation')} transparent>
        <Icon
          name="md-person-add"
          style={{
            fontSize: 25,
            color: 'white',
          }}
        />
      </Button>
    ),
    ...Constant.FiveNavOptions,
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: false, //실서비스에서는 로딩 true로
      user: {
        id: '1',
        name: '혜리',
        image_url: 'https://pbs.twimg.com/profile_images/434151642951213056/h-YeBKj8.jpeg',
        user_info: '안녕하세요 !'
      },
      foods: [
        {
          id: '1',
          location: '망리단길',
          title: '이지첸',
          image_url: 'https://scontent.cdninstagram.com/t51.2885-15/s320x320/sh0.08/e35/21980744_278103439350120_3623176725199847424_n.jpg',
        }, {
          id: '2',
          location: '의정부',
          title: '부대찌개',
          image_url: 'https://img.buzzfeed.com/buzzfeed-static/static/2017-03/29/15/campaign_images/buzzfeed-prod-fastlane-03/26-delicious-korean-foods-you-need-in-your-life-2-30138-1490814365-13_dblbig.jpg',
        }, {
          id: '3',
          location: '강남역',
          title: '도스 타코스',
          image_url: 'https://i.ytimg.com/vi/mEBFswpYms4/maxresdefault.jpg',
        }, {
          id: '4',
          location: '성수동',
          title: '도치 피자',
          image_url: 'https://scontent.cdninstagram.com/t51.2885-15/s320x320/e35/23498854_193592511207603_4852021826986967040_n.jpg',
        }, {
          id: '5',
          location: '성수동',
          title: '치킨앤 파티',
          image_url: 'https://www.chick-fil-a.com/-/media/Images/CFACOM/Menu-Items/WS-Menu-PDP-Images/Entrees/CFA_PDP_ChickNStrips-3ct_1085.ashx',
        },
      ],
      popup: '',
    };
  }

  componentDidMount() {
    this.apiCall();
  }

  apiCall() {
    const config = {
      headers: {
        'X-User-Email': ApplicationStore.email,
        'X-User-Token': ApplicationStore.token,
      },
    };
    axios.get(ApiServer.HOME_INDEX, config)
      .then((response) => {
        console.log(response);
        this.setState({
          loading: false,
        });
      })
      .catch((error) => {
        console.log(error.response);
      });
  }

  deleteCall() {
    this.setState({
      foods: this.state.foods.slice(0,-1) // api상으로 하나 줄어서 리셋시킨다.
    });
  }

  openPopUp(item) {
    this.setState({
      popup: item,
    }, () => this.popupDialog.show());
  }

  renderPopUp(item) {
    const { navigation } = this.props;
    return (
      <PopupDialog
        width={1}
        height={1}
        dismissOnTouchOutside={false}
        dialogStyle={{
          position: 'relative',
          top: -40,
          backgroundColor: 'transparent',
        }}
        ref={(popupDialog) => {
          this.popupDialog = popupDialog;
        }}
      >
        <FoodShow
          item={item}
          marginTop={80}
          marginLeft={20}
          marginRight={20}
          marginBottom={120}
          navigation={navigation}
          closePopUp={() => this.popupDialog.dismiss()}
        />
      </PopupDialog>
    );
  }

  askDelete(item) {
    if (this.state.foods.length <= 3) {
      Alert.alert(
        '알림',
        '3개 이하로 파이브를 삭제할 수 없습니다.',
        [
          {
            text: '확인',
          },
        ],
        { cancelable: true },
      );
    } else {
      Alert.alert(
        '알림',
        '해당 파이브를 삭제하시겠어요?',
        [
          {
            text: '네',
            onPress: () => this.deleteCall(item),
            style: 'cancel',
          },
          { text: '아니요' },
        ],
        { cancelable: true },
      );
    }
  }

  renderFirstThree(openPopUp, askDelete) {
    const { navigation } = this.props;
    const foods = this.state.foods;

    return [ 0, 1, 2 ].map(function (index, i) {
      const item = foods[ index ];
      if (item) {
        return (
          <FoodUnitRound
            key={i}
            id={item.id}
            location={item.location}
            title={item.title}
            image_url={item.image_url}
            onPress={() => openPopUp(item)}
            onLongPress={() => askDelete(item)}
            barWidth={100}
            barHeight={100}
            borderRadius={35}
            marginRight={0}
          />
        );
      } else {
        return (
          <EmptyBox
            key={i}
            barWidth={100}
            onPress={() => navigation.navigate('FoodNew')}
            barHeight={100}
            borderRadius={35}
            marginRight={0}
          />
        );
      }
    });
  }

  renderLastTwo(openPopUp, askDelete) {
    const { navigation } = this.props;
    const foods = this.state.foods;

    return [ 3, 4 ].map(function (index, i) {
      const item = foods[ index ];
      if (item) {
        return (
          <FoodUnitRound
            key={i}
            id={item.id}
            location={item.location}
            title={item.title}
            image_url={item.image_url}
            onPress={() => openPopUp(item)}
            onLongPress={() => askDelete(item)}
            barWidth={100}
            barHeight={100}
            borderRadius={35}
            marginRight={0}
          />
        );
      } else {
        return (
          <EmptyBox
            key={i}
            barWidth={100}
            onPress={() => navigation.navigate('FoodNew')}
            barHeight={100}
            borderRadius={35}
            marginRight={0}
          />
        );
      }

    });
  }

  render() {
    const { container, preLoading, flexBetweenCenter, flexAroundCenter, flexCenterCenter, centerCenter } = BaseStyle;
    const { navigation } = this.props;

    return (
      <Container style={{ backgroundColor: '#FFFFFF' }}>
        <Grid style={{ padding: 10 }}>
          <Row style={{
            height: 140,
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 10,
          }}>
            {this.renderFirstThree((item) => this.openPopUp(item), (item) => this.askDelete(item))}
          </Row>
          <Row style={{
            height: 140,
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}>
            {this.renderLastTwo((item) => this.openPopUp(item), (item) => this.askDelete(item))}
          </Row>
          <Row style={{
            justifyContent: 'center',
          }}>
            <View style={{
              position: 'relative',
              top: -120,
            }}>
              <Button
                style={{
                  width: 70,
                  height: 70,
                  marginBottom: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => console.log('fes')}
                transparent
              >
                <Icon
                  name="ios-share-outline"
                  style={{
                    fontSize: 30,
                    color: '#eee',
                  }}
                />
              </Button>
              <UserUnitRound
                id={this.state.user.id}
                name={this.state.user.name}
                image_url={this.state.user.image_url}
                onPress={() => navigation.navigate('Setting', { title: '설정', user: this.state.user})}
                barWidth={70}
                barHeight={70}
                borderRadius={35}
                marginRight={10}
                fontSize={20}
              />
              <Text note>{this.state.user.user_info}</Text>
            </View>
          </Row>
          <Row style={{
            height: 80,
            justifyContent: 'space-around',
            alignItems: 'center',
          }}>
            <FollowerInfo
              category={'#맛집'}
              followings={'17'}
              followers={'420'}
            />
            <FollowerInfo
              category={'#음악'}
              followings={'24'}
              followers={'299'}
            />
            <FollowerInfo
              category={'#책'}
              followings={'27'}
              followers={'310'}
            />
          </Row>
          <Row style={{
            height: 50,
            justifyContent: 'space-around',
            alignItems: 'center',
          }}>
            <SmallButton
              onPress={() => navigation.navigate('FollowerIndex')}
              title={'팔로워'}
            />
            <SmallButton
              onPress={() => navigation.navigate('MyItemIndex')}
              title={'담아두기'}
            />
          </Row>
        </Grid>
        {this.renderPopUp(this.state.popup)}
        {this.state.loading &&
        <View style={preLoading}>
          <Spinner size="large"/>
        </View>
        }
      </Container>
    );
  }
}
