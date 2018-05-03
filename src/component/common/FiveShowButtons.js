import React, { Component } from 'react';
import {
  View, Alert, FlatList, RefreshControl, Linking, StatusBar, Image,
} from 'react-native';
import {
  Container, Content, Text, Spinner, Thumbnail, Button, Left,
  Body, Toast, ListItem, ActionSheet, List,
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import { FiveUnitRound, ImageCon } from '../../component/common';
import axios from 'axios';
import * as Images from '../../assets/images/Images';
import * as Constant from '../../config/Constant';
import BaseStyle from '../../config/BaseStyle';

import Icon from 'react-native-vector-icons/FontAwesome';


const FiveShowButtons = ({ category, modalNavigation, five }) => {
  const { container } = BaseStyle;

    let buttonHeight = 40;
    let buttonMargin = 16;
    const right_button = Constant.FiveShowButtonRight(category, five);

    return (
        <Grid>
  	        <Row style = {{ height: 56, marginTop: buttonMargin * 2, margin: buttonMargin, alignItems: 'center' }}>
                <View style={{
                  width: 56,
                  height: 56,
                  borderRadius: 8
                }}>
                  <Image style={{ width: buttonHeight, height: buttonHeight, borderRadius: 8 }} source={Images.findImageOf(category)} />
                </View>
                <Button style={{
                  backgroundColor: Constant.LightGrey,
                  height: buttonHeight,
                  width: (Constant.deviceWidth - 56 - buttonMargin * 3) / 2,
                  borderRadius: 6,
                  alignItems: 'center',
                  justifyContent: 'center', 
                  marginRight: 0,
                  elevation: 0,
                }} onPress={() => modalNavigation.navigate('ModalWebViewShow', {
                  url: five.related_link,
                  headerTitle: (category === 'music' ? '가사 보기' : '정보 보기'),
                })}
                >
                  <Text montserrat style = {{ fontSize: 16, fontWeight: 'bold', color: 'white' }} >Info</Text>
                  <Icon name='align-left' 
                    style={{
                      color: 'white',
                      fontSize: 22,
                    }}
                  />
                </Button>
                <Button style={{
                  backgroundColor: Constant.LightGrey,
                  height: buttonHeight,
                  borderRadius: 6,
                  width: (Constant.deviceWidth - 56 - buttonMargin * 3) / 2,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: buttonMargin,
                  marginRight: 16,
                  elevation: 0,
                }} onPress={() => modalNavigation.navigate('ModalWebViewShow', {
                  url: right_button.url,
                  headerTitle: right_button.title
                })}
                >
                  <Text style = {{ fontSize: 16, fontWeight: 'bold', fontFamily: 'montserrat', color: 'white' }}>{right_button.text}</Text>
                  <Icon name={right_button.icon}
                    style={{
                      color: 'white',
                      fontSize: 22,
                    }}
                  />
                </Button>
            </Row>
        </Grid>
      )
}

export { FiveShowButtons };