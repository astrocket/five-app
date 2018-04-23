import React, { Component } from 'react';
import {
  AppRegistry, StyleSheet, Text, View, Platform, Image, ScrollView, TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import {
  Container, Spinner,
  Button, Fab
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import axios from 'axios';
import { NavigationActions } from 'react-navigation';
import { BottomFullButton, MultiToggle } from '../../component/common';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

import Swiper from 'react-native-swiper';

@inject('stores') @observer
export default class Tutorial extends Component {

  static navigationOptions = ({ navigation }) => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.app = this.props.stores.app;
    this.auth = this.props.stores.auth;
    this.state = {
      loading: false,
    };
  }

  render() {
    const { container, preLoading } = BaseStyle;
    const { navigation } = this.props;
    const startAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: 'StartForm',
        }),
      ]
    });

    return (
      <Swiper 
        style={styles.wrapper} 
        showsButtons={false} 
        loop={false} 
        loadMinimal={true}
        activeDotColor={Constant.GreyColor}
      >
        <View style={styles.slide1}>
          <Image
            source={require('../../assets/images/tutorial_1.png')}
            style={{
              height: (Constant.deviceHeight),
              width: Constant.deviceWidth,
            }}
          />
        </View>
        <View style={styles.slide1}>
          <Image
            source={require('../../assets/images/tutorial_2.png')}
            style={{
              height: (Constant.deviceHeight),
              width: Constant.deviceWidth,
            }}
          />
        </View>
        <View style={styles.slide1}>
          <Image
            source={require('../../assets/images/tutorial_3.png')}
            style={{
              height: (Constant.deviceHeight),
              width: Constant.deviceWidth,
            }}
          />
        </View>
        <View style={styles.slide1}>
          <Image
            source={require('../../assets/images/tutorial_4.png')}
            style={{
              height: (Constant.deviceHeight),
              width: Constant.deviceWidth,
            }}
          />
        </View>
        <View style={{
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#fff',
          flex: 1,
          paddingTop: Constant.globalPaddingTop + 10,
        }}>
          <View style={{
            justifyContent: 'flex-start',
            flex: 3,
            width: Constant.deviceWidth
          }}>
            <Image
              source={require('../../assets/images/five_logo.png')}
              style={{
                height: (Constant.deviceWidth / 3),
                width: Constant.deviceWidth / 3,
                margin: 32,
              }}
            />
          </View>
          <View style={{
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            flex: 1,
            width: Constant.deviceWidth,
            backgroundColor: 'white',
          }}>
            <View style={{
              width: Constant.deviceWidth / 3,
              height: 50, 
            }}
            />
            <TouchableOpacity
              onPress={() => navigation.dispatch(startAction)}
              style={{ marginRight: 32, marginBottom: 18, flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.text}>
                시작하기
              </Text>
              <Icon
                name={'chevron-right'}
                style={{
                  fontSize: 28,
                  color: '#EEE',
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Swiper>
    );
  }
}


const styles = StyleSheet.create({
  wrapper: {
  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  text: {
    color: '#4a4a4a',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10
  }
})