import React, { Component } from 'react';
import {
  View, FlatList
} from 'react-native';
import {
  Container, Header, Content, Text, Spinner, Card,
  CardItem, Thumbnail, Button, Icon, Left, Body,
  Right, Segment, H1, Toast,
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import axios from 'axios';
import {
  FollowUserButton, UserUnitRound, FollowerButton, FivesBar
} from '../../component/common';
import * as Images from '../../assets/images/Images';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import PopupDialog from 'react-native-popup-dialog';
import UserFiveRestaurantModal from '../User/UserFiveRestaurantModal';
import { observer, inject } from 'mobx-react/native';

@inject('ApplicationStore') // Inject some or all the stores!
@observer
export default class UserShow extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.title,
    ...Constant.FiveNavOptions,
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: true, //실서비스에서는 로딩 true로
      user: '',
      categories: [],
    };
  }

  componentDidMount() {
    this.apiCall();
  }

  apiCall() {
    const config = {
      headers: {
        'X-User-Email': this.props.ApplicationStore.email,
        'X-User-Token': this.props.ApplicationStore.token,
      },
    };
    axios.get(`${ApiServer.USERS}/${this.props.navigation.state.params.user.id}?category=restaurant`, config)
      .then((response) => {
        this.setState({
          loading: false,
          user: response.data.user,
          categories: response.data.categories,
        });
      })
      .catch((error) => {
        console.log(error.response);
      });
  }


/*  renderRestaurantPopUp(item) {
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
        <UserFiveRestaurantModal
          marginTop={80}
          marginLeft={20}
          marginRight={20}
          marginBottom={120}
          navigation={navigation}
          closePopUp={() => this.popupDialog.dismiss()}
        />
      </PopupDialog>
    );
  }*/

/*  renderRestaurantFollowing() {
    if (this.state.restaurant_following) {
      return (
        <FollowUserButton
          onPress={() => this.toggleRestaurantFollow()}
          title={' 팔로잉'}
          clicked
        />
      );
    } else {
      return (
        <FollowUserButton
          onPress={() => this.toggleRestaurantFollow()}
          title={'+팔로우 '}
        />
      );
    }
  }*/

  render() {
    const { preLoading } = BaseStyle;
    const { navigation } = this.props;

    return (
      <Container style={{ backgroundColor: '#FFFFFF' }}>
        <Grid>
          <Row style={{
            height: 250,
            alignItems: 'center',
          }}>
            <Col style={{ alignItems: 'center' }}>
              <UserUnitRound
                id={this.state.user.id}
                name={this.state.user.name}
                image_url={this.state.user.image_medium_url}
                barWidth={130}
                barHeight={130}
                borderRadius={65}
                marginRight={10}
                fontSize={25}
                large
              />
              <Text note style={{ width: 250, textAlign: 'center' }}>{this.state.user.introduce}</Text>
            </Col>
          </Row>
          <FlatList
            data={this.state.categories}
            style={{paddingBottom: 15}}
            renderItem={({ item }) => (
              <FivesBar
                onPress={() => navigation.navigate('UserFiveShow', { user: this.props.navigation.state.params.user ,category_data: item, five_category: item.klass.toLowerCase(), navLoading: true })}
                category={item.category}
                followers={item.followers_count}
                followees={item.followees_count}
                fives={item.fives}
                image={Images.findImageOf(item.klass.toLowerCase())}
              />
            )}
            keyExtractor={item => 'five-category-list-' + item.id}
            ListFooterComponent={
              <FivesBar
                onPress={() =>
                  Toast.show({
                  text: '더미카테고리',
                  position: 'bottom',
                  duration: 1500,
                })}
                category={'더미데이터'}
                followers={'222'}
                followees={'242'}
                fives={[]}
                image={Images.restaurant_main}
              />
            }
          />
{/*          <Row style={{
            height: 100,
            alignItems: 'center',
          }}>
            <Col style={{ justifyContent: 'center', alignItems: 'center' }}>
              <FollowerButton
                onPress={() => this.popupDialog.show()}
                title={'맛집'}
                followees={this.state.restaurant_followees_count}
                followers={this.state.restaurant_followers_count}
              />
            </Col>
            <Col style={{ justifyContent: 'center', alignItems: 'center' }}>
              <FollowerButton
                title={'음악'}
                followees={'24'}
                followers={'299'}
              />
            </Col>
            <Col style={{ justifyContent: 'center', alignItems: 'center' }}>
              <FollowerButton
                title={'책'}
                followees={'27'}
                followers={'310'}
              />
            </Col>
          </Row>
          <Row style={{
            height: 50,
            alignItems: 'center'
          }}>
            <Col style={{ justifyContent: 'center', alignItems: 'center' }}>
              <View>
                {this.renderRestaurantFollowing()}
              </View>
            </Col>
            <Col style={{ justifyContent: 'center', alignItems: 'center' }}>
              <View>
                <FollowUserButton
                  onPress={() => console.log('hi')}
                  title={'+팔로우 '}
                />
              </View>
            </Col>
            <Col style={{ justifyContent: 'center', alignItems: 'center' }}>
              <View>
                <FollowUserButton
                  onPress={() => console.log('hi')}
                  title={'+팔로우 '}
                />
              </View>
            </Col>
          </Row>
        {this.renderRestaurantPopUp()}*/}
        </Grid>
        {this.state.loading &&
        <View style={preLoading}>
          <Spinner size="large"/>
        </View>
        }
      </Container>
    );
  }
}
