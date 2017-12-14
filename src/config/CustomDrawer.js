import React, { Component } from 'react';
import {
  View, Dimensions, Platform,
} from 'react-native';
import {
  Container, Header, Content, Text, Spinner,
  Thumbnail,
  ListItem,
  Left,
  Body,
  Right,
  H3, Icon
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import { MenuBar } from '../component/common';
import axios from 'axios';
import * as ApiServer from './ApiServer';
import BaseStyle from './BaseStyle';
import ApplicationStore from '../mobx/ApplicationStore';

export default class CustomDrawer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false, //실서비스에서는 로딩 true로
      user: {
        id: '1',
        name: '혜리',
        image_url: 'https://pbs.twimg.com/profile_images/434151642951213056/h-YeBKj8.jpeg',
      },
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

  render() {
    const { container, preLoading } = BaseStyle;
    const { navigation } = this.props;

    const deviceHeight = Dimensions.get('window').height;
    const deviceWidth = Dimensions.get('window').width;
    const platform = Platform.OS;
    const isIphoneX = platform === 'ios' && deviceHeight === 812 && deviceWidth === 375;


    return (
      <Container>
        <Grid>
          <Row style={{
            paddingTop: platform === "ios" ? (isIphoneX ? 39 : 15) : 0,
            height: 100,
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}>
            <ListItem avatar transparent>
              <Left>
                <Thumbnail source={{ uri: this.state.user.image_url }}/>
              </Left>
              <Right style={{ justifyContent: 'center', alignItems: 'flex-start', marginLeft: 10, borderBottomWidth: 0 }}>
                <H3 style={{ textAlign: 'center'}}>{this.state.user.name}</H3>
                <Text note>대한민국 서울</Text>
              </Right>
            </ListItem>
          </Row>
          <Row style={{ backgroundColor: '#eee', justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column' }}>
            <MenuBar
              onPress={() => navigation.navigate('Invitation')}
              icon={'logo-apple'}
              title={'친구 초대하기'}
            />
            <MenuBar
              onPress={() => navigation.navigate('Invitation')}
              icon={'logo-apple'}
              title={'친구 초대하기'}
            />
            <MenuBar
              onPress={() => navigation.navigate('Invitation')}
              icon={'logo-apple'}
              title={'친구 초대하기'}
            />
          </Row>
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
