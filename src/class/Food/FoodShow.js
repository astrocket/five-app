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
  H1
} from 'native-base';
import {
  Col,
  Row,
  Grid,
} from 'react-native-easy-grid';
import {
  SmallButton,
} from '../../component/common';
import axios from 'axios';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import ApplicationStore from '../../mobx/ApplicationStore';

export default class FoodShow extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false, //실서비스에서는 로딩 true로
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
      <Grid style={{ margin: 20 }}>
        <Row style={{
          height: 200,
          width: null,
        }}>
          <Image source={{ uri: this.props.item.image_url }} style={{
            height: null,
            width: null,
            flex: 1,
          }}/>
        </Row>
        <Row style={{
          marginTop: 20,
          marginBottom: 20,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <H1 style={{ textAlign: 'center' }}>
            {`${this.props.item.location} ${this.props.item.title}`}
          </H1>
          <Button
            onPress={() => navigation.navigate('Map', {
              lat: '33',
              lng: '22',
              title: this.props.item.title,
            })}
            transparent
            style={{
              position: 'absolute',
              right: 0,
              top: -5,
            }}
          >
            <Icon
              name="ios-map-outline"
              style={{
                fontSize: 25,
                color: '#000',
              }}
            />
          </Button>
        </Row>
        <Row style={{
          marginBottom: 20,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Text>현재 124명의 Five</Text>
        </Row>
        <Row style={{
          marginBottom: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <SmallButton
            onPress={() => console.log('hi')}
            title={'공유하기'}
          />
          <SmallButton
            onPress={() => console.log('hi')}
            title={'담아두기'}
          />
        </Row>
      </Grid>
    );
  }
}
