import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import {
  Container, Header, Content, Text, Spinner, Icon, Button, H1,
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import {
  RestaurantUnitRound, UserUnitRound, SmallButton,
} from '../../component/common';
import RestaurantShow from './RestaurantModal';
import axios from 'axios';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import ApplicationStore from '../../mobx/ApplicationStore';

export default class RestaurantIndex extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: '#맛집',
    headerRight: (
      <Button onPress={() => navigation.navigate('Invitation')} transparent>
        <Icon
          name="md-person-add"
          style={{
            fontSize: 25,
            color: Constant.FiveColor,
          }}
        />
      </Button>
    ),
    ...Constant.FiveNavOptions,
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: false, //실서비스에서는 로딩 true로
      restaurants: [],
      users: [],
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
    axios.get(ApiServer.RESTAURANTS, config)
      .then((response) => {
        this.setState({
          restaurants: response.data.restaurants,
          users: response.data.users
        })
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
          <Grid style={{ marginBottom: 20 }}>
            <View style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: 10,
              paddingBottom: 10,
              paddingLeft: 10,
              paddingRight: 10,
            }}>
              <Text medium>새로 친구들의 five로 선정 된 맛집</Text>
              <TouchableOpacity onPress={() => navigation.navigate('RestaurantList', {
                restaurants: this.state.restaurants,
              })} underlayColor={'#fff'}>
                <Text primary>더보기</Text>
              </TouchableOpacity>
            </View>
            <Row style={{ marginBottom: 20 }}>
              <FlatList
                horizontal
                data={this.state.restaurants}
                style={{
                  paddingLeft: 10,
                  paddingRight: 20,
                }}
                renderItem={({ item }) => (
                  <RestaurantUnitRound
                    id={item.id}
                    location={item.location}
                    title={item.title}
                    five_users_count={item.five_users_count}
                    image_url={item.image_url}
                    onPress={() => navigation.navigate('RestaurantShow', { title: item.title, id: item.id, navLoading: true })}
                    barWidth={150}
                    barHeight={150}
                    borderRadius={15}
                    marginRight={10}
                  />
                )}
                keyExtractor={item => 'restaurant-' + item.id}
              />
            </Row>
            <View style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: 10,
              paddingBottom: 10,
              paddingLeft: 10,
              paddingRight: 10,
            }}>
              <Text medium>새로 five 를 바꾼 친구</Text>
              <TouchableOpacity onPress={() => navigation.navigate('UserList', {
                users: this.state.users,
              })} underlayColor={'#fff'}>
                <Text primary>더보기</Text>
              </TouchableOpacity>
            </View>
            <Row style={{ marginBottom: 20 }}>
              <FlatList
                horizontal
                data={this.state.users}
                style={{
                  paddingLeft: 10,
                  paddingRight: 20,
                }}
                renderItem={({ item }) => (
                  <UserUnitRound
                    id={item.id}
                    name={item.name}
                    image_url={item.image_url}
                    onPress={() => navigation.navigate('UserShow', {
                      user: item,
                      title: item.name,
                    })}
                    barWidth={90}
                    barHeight={90}
                    borderRadius={45}
                    marginRight={10}
                  />
                )}
                keyExtractor={item => 'user-' + item.id}
              />
            </Row>
            <View style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingTop: 10,
              paddingBottom: 10,
              paddingLeft: 10,
              paddingRight: 10,
            }}>
              <Text>나의 five 맛집</Text>
              <TouchableOpacity underlayColor={'#fff'}>
                <Icon name="ios-refresh-outline" style={{ color: '#a7a7a7' }}/>
              </TouchableOpacity>
            </View>
            <Row>
              {/*소식으로 기획 변경*/}
            </Row>
          </Grid>
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
