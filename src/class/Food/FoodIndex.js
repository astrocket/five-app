import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import {
  Container, Header, Content, Text, Spinner, Icon, Button, H1,
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import {
  FoodUnitRound, UserUnitRound, SmallButton,
} from '../../component/common';
import FoodShow from './FoodShow';
import axios from 'axios';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import ApplicationStore from '../../mobx/ApplicationStore';
import PopupDialog from 'react-native-popup-dialog';

export default class FoodIndex extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: '#맛집',
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
        }, {
          id: '6',
          location: '부산역',
          title: '중문횟집',
          image_url: 'https://halfoff.adspayusa.com/wp-content/uploads/2017/04/sushi_and_sashimi_for_two.0.jpg',
        },
      ],
      users: [
        {
          id: '1',
          name: '혜리',
          image_url: 'https://pbs.twimg.com/profile_images/434151642951213056/h-YeBKj8.jpeg',
        }, {
          id: '2',
          name: '김유정',
          image_url: 'https://pbs.twimg.com/profile_images/846361396296241152/zK7wpe1o.jpg',
        }, {
          id: '3',
          name: '설현',
          image_url: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/160911_%EB%8F%99%ED%83%84_%EC%97%94%ED%84%B0%EC%8B%9D%EC%8A%A4_%EC%84%A4%ED%98%84_%ED%8C%AC%EC%8B%B8%EC%9D%B8%ED%9A%8C.jpg',
        }, {
          id: '4',
          name: 'Taylor Swift',
          image_url: 'https://www.grammy.com/sites/com/files/styles/image_landscape_hero/public/taylorswift-hero-510837066.jpg?itok=VeBknRmv',
        }, {
          id: '5',
          name: 'Leo',
          image_url: 'https://cdn1.thr.com/sites/default/files/imagecache/landscape_928x523/2014/11/leonardo_dicaprio.jpg',
        }, {
          id: '6',
          name: '혜리',
          image_url: 'https://pbs.twimg.com/profile_images/434151642951213056/h-YeBKj8.jpeg',
        }, {
          id: '7',
          name: '김유정',
          image_url: 'https://pbs.twimg.com/profile_images/846361396296241152/zK7wpe1o.jpg',
        }, {
          id: '8',
          name: '설현',
          image_url: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/160911_%EB%8F%99%ED%83%84_%EC%97%94%ED%84%B0%EC%8B%9D%EC%8A%A4_%EC%84%A4%ED%98%84_%ED%8C%AC%EC%8B%B8%EC%9D%B8%ED%9A%8C.jpg',
        }, {
          id: '9',
          name: 'Taylor Swift',
          image_url: 'https://www.grammy.com/sites/com/files/styles/image_landscape_hero/public/taylorswift-hero-510837066.jpg?itok=VeBknRmv',
        }, {
          id: '10',
          name: 'Leo',
          image_url: 'https://cdn1.thr.com/sites/default/files/imagecache/landscape_928x523/2014/11/leonardo_dicaprio.jpg',
        },
      ],
      popup: '',
      flip: false,
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
          foods: [ response.foods ],
        });
      })
      .catch((error) => {
        console.log(error.response);
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
          navigation={navigation}
          marginTop={100}
          marginLeft={20}
          marginRight={20}
          marginBottom={100}
          closePopUp={() => this.popupDialog.dismiss()}
        />
      </PopupDialog>
    );
  }

  render() {
    const { container, preLoading } = BaseStyle;
    const { navigation } = this.props;

    return (
      <Container>
        <Content>
          <Grid style={{ marginBottom: 20 }}>
            <View style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingTop: 10,
              paddingBottom: 10,
              paddingLeft: 10,
              paddingRight: 10,
            }}>
              <Text>새로 친구들의 five로 선정 된 맛집</Text>
              <TouchableOpacity onPress={() => navigation.navigate('FoodList', {
                foods: this.state.foods,
              })} underlayColor={'#fff'}>
                <Text note>전체보기 ></Text>
              </TouchableOpacity>
            </View>
            <Row style={{ marginBottom: 20 }}>
              <FlatList
                horizontal
                data={this.state.foods}
                style={{
                  paddingLeft: 10,
                  paddingRight: 20,
                }}
                renderItem={({ item }) => (
                  <FoodUnitRound
                    id={item.id}
                    location={item.location}
                    title={item.title}
                    image_url={item.image_url}
                    onPress={() => this.openPopUp(item)}
                    barWidth={100}
                    barHeight={100}
                    borderRadius={35}
                    marginRight={10}
                  />
                )}
                keyExtractor={item => 'food-' + item.id}
              />
            </Row>
            <View style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingTop: 10,
              paddingBottom: 10,
              paddingLeft: 10,
              paddingRight: 10,
            }}>
              <Text>새로 five 를 바꾼 친구</Text>
              <TouchableOpacity onPress={() => navigation.navigate('UserList', {
                users: this.state.users,
              })} underlayColor={'#fff'}>
                <Text note>전체보기 ></Text>
              </TouchableOpacity>
            </View>
            <Row style={{ marginBottom: 20 }}>
              <FlatList
                horizontal
                data={this.state.users}
                style={{
                  paddingLeft: 10,
                  paddingRight: 20,
                }}
                renderItem={({ item }) => (
                  <UserUnitRound
                    id={item.id}
                    name={item.name}
                    image_url={item.image_url}
                    onPress={() => navigation.navigate('UserShow', {
                      user: item,
                      title: item.name,
                    })}
                    barWidth={60}
                    barHeight={60}
                    borderRadius={30}
                    marginRight={10}
                  />
                )}
                keyExtractor={item => 'user-' + item.id}
              />
            </Row>
            <View style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingTop: 10,
              paddingBottom: 10,
              paddingLeft: 10,
              paddingRight: 10,
            }}>
              <Text>나의 five 맛집</Text>
              <TouchableOpacity underlayColor={'#fff'}>
                <Icon name="ios-refresh-outline" style={{ color: '#a7a7a7' }}/>
              </TouchableOpacity>
            </View>
            <Row>
              <FlatList
                horizontal
                data={this.state.foods.slice(0, 5)}
                style={{
                  paddingLeft: 10,
                  paddingRight: 20,
                }}
                renderItem={({ item }) => (
                  <FoodUnitRound
                    id={item.id}
                    location={item.location}
                    title={item.title}
                    image_url={item.image_url}
                    onPress={() => this.openPopUp(item)}
                    barWidth={60}
                    barHeight={60}
                    borderRadius={15}
                    marginRight={10}
                  />
                )}
                keyExtractor={item => 'my-food-' + item.id}
              />
            </Row>
          </Grid>
        </Content>
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
