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

export default class TabC extends Component {

  static navigationOptions = ({ navigation }) => ({
    tabBarLabel: '검색',
    tabBarIcon: ({ tintColor }) => (
      <Icon
        name="ios-search-outline"
        style={{
          fontSize: 25,
          color: tintColor,
        }}
      />
    ),
    title: '검색창',
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
      loading: true,
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
          <Text>행복은 직접 만들어가는 것</Text>
          <TouchableOpacity onPress={() => navigation.navigate('PageC')}>
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
