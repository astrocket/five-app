import React, { Component } from 'react';
import {
  View,
  Image,
} from 'react-native';
import {
  Container,
  Header,
  Content,
  Text,
  Spinner,
  Card,
  CardItem,
  Thumbnail,
  Button,
  Icon,
  Left,
  Body,
  Right,
  Segment,
} from 'native-base';
import {
  Col,
  Row,
  Grid,
} from 'react-native-easy-grid';
import axios from 'axios';
import { FoodUnitRound, UserUnitRound } from '../../component/common';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import ApplicationStore from '../../mobx/ApplicationStore';

export default class UserShow extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.title,
    ...Constant.FiveNavOptions,
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: false, //실서비스에서는 로딩 true로
      user: this.props.navigation.state.params.user,
      foodFollowing: false,
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

  toggleFollow() {
    this.setState({
      foodFollowing: !this.state.foodFollowing
    })
  }

  renderFirstThree() {
    const { navigation } = this.props;
    return this.state.foods.slice(0, 3).map(function (item, i) {
      return (
        <FoodUnitRound
          key={i}
          id={item.id}
          location={item.location}
          title={item.title}
          image_url={item.image_url}
          onPress={() => navigation.navigate('FoodShow', {
            food: item,
            title: item.title,
          })}
          barWidth={100}
          barHeight={100}
          borderRadius={35}
          marginRight={0}
        />
      );
    });
  }

  renderLastTwo() {
    const { navigation } = this.props;
    return this.state.foods.slice(3, 5).map(function (item, i) {
      return (
        <FoodUnitRound
          key={i}
          id={item.id}
          location={item.location}
          title={item.title}
          image_url={item.image_url}
          onPress={() => navigation.navigate('FoodShow', {
            food: item,
            title: item.title,
          })}
          barWidth={100}
          barHeight={100}
          borderRadius={35}
          marginRight={0}
        />
      );
    });
  }

  renderFoodFollowing() {
    if (this.state.foodFollowing) {
      return (
        <Button block small warning full
                onPress={() => this.toggleFollow()}
                style={{ borderRadius: 5, paddingTop: 2, marginBottom: 10 }}
        >
          <Text>맛집</Text>
        </Button>
      )
    } else {
      return (
        <Button bordered small danger full
                onPress={() => this.toggleFollow()}
                style={{ borderRadius: 5, paddingTop: 2, marginBottom: 10 }}
        >
          <Text>맛집</Text>
        </Button>
      )
    }
  }

  render() {
    const { container, preLoading, flexBetweenCenter, flexAroundCenter, flexCenterCenter } = BaseStyle;
    const { navigation } = this.props;

    return (
      <Container>
        <Content padder>
          <Grid>
            <Row style={[flexBetweenCenter, {marginBottom: 10}]}>
              {this.renderFirstThree()}
            </Row>
            <Row style={flexBetweenCenter}>
              {this.renderLastTwo()}
            </Row>
            <Row style={{ flex: 1, justifyContent: 'center'}}>
              <View style={{ position: 'relative', top: - 120}}>
                <Button
                  style={[flexCenterCenter, { width: 70, height: 70, marginBottom: 20}]}
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
                  barWidth={70}
                  barHeight={70}
                  borderRadius={35}
                  marginRight={10}
                  fontSize={20}
                />
              </View>
            </Row>
            <Row style={[flexAroundCenter]}>
              <View style={{ width: 100 }}>
                {this.renderFoodFollowing()}
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                  <Text style={{ fontWeight: '500' }}>27</Text><Text note style={{ fontSize: 11, paddingTop: 2 }}> 팔로잉</Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                  <Text style={{ fontWeight: '500' }}>317</Text><Text note style={{ fontSize: 11, paddingTop: 2 }}> 팔로워</Text>
                </View>
              </View>
              <View style={{ width: 100 }}>
                <Button bordered small danger full
                        onPress={() => console.log('hi')}
                        style={{ borderRadius: 5, paddingTop: 2, marginBottom: 10 }}
                >
                  <Text>음악</Text>
                </Button>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                  <Text style={{ fontWeight: '500' }}>27</Text><Text note style={{ fontSize: 11, paddingTop: 2 }}> 팔로잉</Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                  <Text style={{ fontWeight: '500' }}>317</Text><Text note style={{ fontSize: 11, paddingTop: 2 }}> 팔로워</Text>
                </View>
              </View>
              <View style={{ width: 100 }}>
                <Button bordered small danger full
                        onPress={() => console.log('hi')}
                        style={{ borderRadius: 5, paddingTop: 2, marginBottom: 10 }}
                >
                  <Text>책</Text>
                </Button>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                  <Text style={{ fontWeight: '500' }}>27</Text><Text note style={{ fontSize: 11, paddingTop: 2 }}> 팔로잉</Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                  <Text style={{ fontWeight: '500' }}>317</Text><Text note style={{ fontSize: 11, paddingTop: 2 }}> 팔로워</Text>
                </View>
              </View>
            </Row>
          </Grid>
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
