import React, { Component } from 'react';
import {
  View, Platform, TouchableOpacity, Image, AsyncStorage,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  Container, Header, Content, Text, Spinner, Button,
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import { NavigationActions } from 'react-navigation'
import axios from 'axios';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('ApplicationStore') // Inject some or all the stores!
@observer
export default class Welcome extends Component {

  static navigationOptions = ({ navigation }) => ({
    header: null,
    ...Constant.FiveNavOptions,
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      token : 'none',
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
      <Container>
        <View style={{
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#fff',
          flex: 1,
          paddingTop: Platform.OS === 'ios' ? 20 : 0,
        }}>
          <View style={{
            justifyContent: 'flex-start',
            flex: 1,
            width: Constant.deviceWidth
          }}>
            <Image
              source={require('../../assets/images/five_logo.png')}
              style={{
                height: (Constant.deviceWidth / 3) + 5,
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
        {this.state.loading &&
        <View style={preLoading}>
          <Spinner size="large"/>
        </View>
        }
      </Container>
    );
  }
}
