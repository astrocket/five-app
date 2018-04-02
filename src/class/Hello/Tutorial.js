import React, { Component } from 'react';
import {
  View, Platform, Image, ScrollView, TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import {
  Container, Text, Spinner,
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

@inject('ApplicationStore') // Inject some or all the stores!
@observer
export default class Tutorial extends Component {

  static navigationOptions = ({ navigation }) => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      submiting: false,
    };
  }

  apiCall() {
    const config = {
      headers: {
        'X-User-Email': this.props.ApplicationStore.email,
        'X-User-Token': this.props.ApplicationStore.token,
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

  renderButton() {
    if (this.state.submiting) {
      return <Spinner size="small" />;
    }

    return (
      <BottomFullButton
        onPress={() =>
          this.props.ApplicationStore.signIn()
        }>
        확인
      </BottomFullButton>
    );
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
      <Container>
        <View style={{
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#fff',
          flex: 1,
          paddingTop: Platform.OS === 'ios' ? 20 : 0,
        }}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          >
            <View style={{ width: Constant.deviceWidth, flex: 1}}>
              <Image
                source={require('../../assets/images/tutorial_1.png')}
                style={{
                  height: (Constant.deviceHeight),
                  width: Constant.deviceWidth,
                }}
              />
            </View>
            <View style={{ width: Constant.deviceWidth, flex: 1}}>
              <Image
                source={require('../../assets/images/tutorial_2.png')}
                style={{
                  height: (Constant.deviceHeight),
                  width: Constant.deviceWidth,
                }}
              />
            </View>
            <View style={{ width: Constant.deviceWidth, flex: 1}}>
              <Image
                source={require('../../assets/images/tutorial_3.png')}
                style={{
                  height: (Constant.deviceHeight),
                  width: Constant.deviceWidth,
                }}
              />
            </View>
            <View style={{ width: Constant.deviceWidth, flex: 1}}>
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
              paddingTop: Constant.globalPaddingTop,
            }}>
              <View style={{
                justifyContent: 'flex-start',
                flex: 1,
                width: Constant.deviceWidth
              }}>
                <Image
                  source={require('../../assets/images/five_logo.png')}
                  style={{
                    height: (Constant.deviceWidth / 3),
                    width: Constant.deviceWidth / 3,
                    margin: 20,
                  }}
                />
              </View>
              <View style={{
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
                flex: 1,
                width: Constant.deviceWidth
              }}>
                <TouchableOpacity
                  onPress={() => navigation.dispatch(startAction)}
                  style={{ margin: 20, flexDirection: 'row' }}>
                  <Text large style={{ marginRight: 5 }}>
                    시작하기
                  </Text>
                  <Icon
                    name={'chevron-right'}
                    style={{
                      fontSize: 25,
                      color: '#EEE',
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
          <Fab
            active={true}
            direction="up"
            style={{ backgroundColor: Constant.GreyColor }}
            position="bottomLeft"
            onPress={() => navigation.dispatch(startAction)}>
            <Text micro note>skip</Text>
          </Fab>
        </View>
        {this.state.loading &&
        <View style={preLoading}>
          <Spinner size="large"/>
        </View>
        }
      </Container>
    );
  }
}
