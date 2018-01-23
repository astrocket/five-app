import React, { Component } from 'react';
import {
  View, Platform, Image,
} from 'react-native';
import {
  Container, Header, Content, Text, Spinner,
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
export default class Hello extends Component {

  static navigationOptions = ({ navigation }) => ({
    headerStyle: {
      backgroundColor: 'white',
      borderBottomWidth: 0,
    },
    headerTintColor: '#FA3F97',
    headerBackTitleStyle: {
      color: '#FA3F97',
    },
    headerTitleStyle: {
      color: 'black',
    },
    drawerLockMode: 'locked-closed',
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      left_clicked: false,
      center_clicked: false,
      right_clicked: false,
      unselected: true,
      input_category: '',
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

    if (this.state.unselected) {
      return (
        <BottomFullButton disabled>
          FIVE 추가하러가기
        </BottomFullButton>
      );
    }

    return (
      <BottomFullButton onPress={() =>
        this.props.navigation.dispatch(
          NavigationActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({
                routeName: 'AddFive',
                params: { category: this.state.input_category, title: `${this.state.korean} FIVE 참여` },
              }),
            ],
          }))
      }>
        FIVE 추가하러가기
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
          <View style={{
            justifyContent: 'space-around',
            alignItems: 'center',
            flex: 1,
            width: Constant.deviceWidth
          }}>
            <Image
              source={require('../../assets/images/five_logo.png')}
              style={{
                height: (Constant.deviceWidth / 3) + 5,
                width: Constant.deviceWidth / 3,
              }}
            />
            <Text large>주제 선택하기</Text>
            <Text note style={{ textAlign: 'center' }}>어떤 주제에서{'\n'}좋아하는 아이템을 하나 선택해 볼까요?</Text>
          </View>
        </View>
        <View style={{ height: 200 }}>
          <MultiToggle
            leftText={'맛집'}
            leftImage={'restaurant'}
            leftClicked={this.state.left_clicked}
            centerText={'음악'}
            centerImage={'music'}
            centerClicked={this.state.center_clicked}
            rightText={'책'}
            rightClicked={this.state.right_clicked}
            rightImage={'book'}
            onLeftPress={() => this.setState({input_category: 'retaurant', korean: '맛집', left_clicked: true, center_clicked: false, right_clicked: false, unselected: false})}
            onCenterPress={() => this.setState({input_category: 'music', korean: '음악', left_clicked: false, center_clicked: true, right_clicked: false, unselected: false})}
            onRightPress={() => this.setState({input_category: 'book', korean: '책', left_clicked: false, center_clicked: false, right_clicked: true, unselected: false})}
          />
        </View>
        <View style={{ height: 50, }}>
          {this.renderButton()}
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
