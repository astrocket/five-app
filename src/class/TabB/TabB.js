import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
} from 'react-native';
import {
  Container,
  Content,
  Text,
  Spinner,
  Icon,
} from 'native-base';
import {
  Col,
  Row,
  Grid,
} from 'react-native-easy-grid';
import axios from 'axios';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import ApplicationStore from '../../mobx/ApplicationStore';

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
    title: 'MY FIVE 맛집',
    headerStyle: {
      backgroundColor: '#FF9800',
    },
    headerTintColor: 'white',
    headerBackTitleStyle: {
      color: 'white',
    },
    headerTitleStyle: {
      color: 'white',
    },
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: false, //실서비스에서는 로딩 true로
    };
  }

  componentDidMount() {
    console.log(this.props.navigation);
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

    return (
      <Container>
        <View style={container}>
          <Text>꿈은 모든것의 원동력</Text>
          <TouchableOpacity onPress={() => navigation.navigate('PageB', { title: '이한결의 꿈' })}>
            <Text note>어떻게 ?</Text>
          </TouchableOpacity>
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
