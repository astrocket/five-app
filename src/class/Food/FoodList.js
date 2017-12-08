import React, { Component } from 'react';
import {
  View,
  FlatList,
} from 'react-native';
import {
  Container,
  Header,
  Content,
  Text,
  Spinner,
} from 'native-base';
import {
  Col,
  Row,
  Grid,
} from 'react-native-easy-grid';
import { FoodUnitBar } from '../../component/common';
import axios from 'axios';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import ApplicationStore from '../../mobx/ApplicationStore';

export default class FoodList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false, //실서비스에서는 로딩 true로
      foods: this.props.navigation.state.params.foods
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

    return (
      <Container>
        <Content>
          <FlatList
            data={this.state.foods}
            renderItem={({ item }) => (
              <FoodUnitBar
                id={item.id}
                title={item.title}
                location={item.location}
                image_url={item.image_url}
                onPress={() => navigation.navigate('FoodShow', {
                  food: item,
                  title: item.name,
                })}
              />
            )}
            keyExtractor={item => 'food-list-' + item.id}
          />
        </Content>
        {this.state.loading &&
        <View style={preLoading}>
          <Spinner size="large" />
        </View>
        }
      </Container>
    );
  }
}
