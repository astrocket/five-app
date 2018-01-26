import React, { Component } from 'react';
import {
  View, FlatList
} from 'react-native';
import {
  Container, Header, Content, Text,
  Spinner, Card, CardItem, Thumbnail,
  Button, Icon, Left, Body,
  Right, Segment, H1, H3, Toast
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import {
  UserUnitRound, FivesBar,
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
    headerRight: (
      <Button onPress={() => navigation.navigate('ProfileWishIndex')} transparent>
        <Icon
          name="ios-cube-outline"
          style={{
            fontSize: 25,
            color: Constant.FiveColor,
          }}
        />
      </Button>
    ),
    ...Constant.FiveNavOptions,
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: true, //실서비스에서는 로딩 true로
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
    axios.get(`${ApiServer.MY_PROFILE}?category=restaurant`, config)
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

/*  renderRestaurantPopUp() {
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
        ref={(tabBDialog) => {
          this.tabBDialog = tabBDialog;
        }}
      >
        <MyFiveRestaurantModal
          marginTop={80}
          marginLeft={20}
          marginRight={20}
          marginBottom={120}
          navigation={navigation}
          closePopUp={() => this.tabBDialog.dismiss()}
        />
      </PopupDialog>
    );
  }*/

  render() {
    const { preLoading } = BaseStyle;
    const { navigation } = this.props;
    const { my_profile } = this.props.ApplicationStore;

    return (
      <Container style={{ backgroundColor: '#FFFFFF' }}>
        <Grid>
          <Row style={{
            height: 250,
            alignItems: 'center',
          }}>
            <Col style={{ alignItems: 'center' }}>
              <UserUnitRound
                id={my_profile.id}
                name={my_profile.name}
                image_url={my_profile.image_medium_url}
                onPress={() => navigation.navigate('Setting')}
                barWidth={130}
                barHeight={130}
                borderRadius={65}
                marginRight={10}
                fontSize={25}
                large
              />
              <Text note style={{ width: 250, textAlign: 'center' }}>{my_profile.introduce}</Text>
            </Col>
          </Row>
          <FlatList
            data={this.state.categories}
            style={{paddingBottom: 15}}
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
        </Grid>
{/*
        {this.renderRestaurantPopUp()}
*/}
        {this.state.loading &&
        <View style={preLoading}>
          <Spinner size="large"/>
        </View>
        }
      </Container>
    );
  }
}
