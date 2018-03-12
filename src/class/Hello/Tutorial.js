import React, { Component } from 'react';
import {
  View, Platform, Image, ScrollView,
} from 'react-native';
import {
  Container, Header, Content, Text, Spinner, ListItem, List, Left, Body, Thumbnail, Card, CardItem,
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
              <Text>회원 가입 완료</Text>
            </View>
            <View style={{ width: Constant.deviceWidth, flex: 1}}>
              <Text>튜토리얼 1</Text>
            </View>
            <View style={{ width: Constant.deviceWidth, flex: 1}}>
              <Text>튜토리얼 2</Text>
            </View>
            <View style={{ width: Constant.deviceWidth, flex: 1}}>
              <Text>튜토리얼 3</Text>
            </View>
            <View style={{ width: Constant.deviceWidth, flex: 1}}>
              <View style={{ flex: 1 }}>
                <Text>튜토리얼 4</Text>
              </View>
              <View style={{ height: 50, }}>
                {this.renderButton()}
              </View>
            </View>
          </ScrollView>
          <Fab
            active={true}
            direction="up"
            style={{ backgroundColor: Constant.FiveColor }}
            position="bottomLeft"
            onPress={() => this.props.ApplicationStore.signIn()}>
            <Text micro note>생략</Text>
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
