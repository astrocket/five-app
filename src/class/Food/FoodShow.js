import React, { Component } from 'react';
import {
  View,
  Image,
} from 'react-native';
import {
  Container,
  Header,
  Content,
  Text,
  Spinner,
  Card,
  CardItem,
  Thumbnail,
  Button,
  Icon,
  Left,
  Body,
  Right,
} from 'native-base';
import {
  Col,
  Row,
  Grid,
} from 'react-native-easy-grid';
import axios from 'axios';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import ApplicationStore from '../../mobx/ApplicationStore';

export default class FoodShow extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.title,
    ... Constant.FiveNavOptions,
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: false, //실서비스에서는 로딩 true로
      food: this.props.navigation.state.params.food,
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
          <Content>
            <Card>
              <CardItem>
                <Left>
                  <Thumbnail source={{ uri: this.state.food.image_url }}/>
                  <Body>
                  <Text>{this.state.food.name}</Text>
                  <Text note>{this.state.food.location}</Text>
                  </Body>
                </Left>
              </CardItem>
              <CardItem cardBody>
                <Image source={{ uri: this.state.food.image_url }} style={{
                  height: 200,
                  width: null,
                  flex: 1,
                }}/>
              </CardItem>
            </Card>
          </Content>
        </Content>
        {this.state.loading &&
        <View style={preLoading}>
          <Spinner size="large"/>
        </View>
        }
      </Container>
    );
  }
}
