import React, { Component } from 'react';
import {
  View, FlatList, RefreshControl
} from 'react-native';
import {
  Container, Content, Text, Spinner,
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import axios from 'axios';
import {
  UserUnitRound, FivesBar
} from '../../component/common';
import * as Images from '../../assets/images/Images';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('ApplicationStore') // Inject some or all the stores!
@observer
export default class UserShow extends Component {

  static navigationOptions = ({ navigation }) => ({
    ...Constant.FiveNavOptions,
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: true, //실서비스에서는 로딩 true로
      refreshing: false,
      header: {
        headers: {
          'X-User-Email': this.props.ApplicationStore.email,
          'X-User-Token': this.props.ApplicationStore.token,
        },
      },
      user: '',
      categories: [],
    };
  }

  componentDidMount() {
    this.apiCall();
  }

  async apiCall() {
    await axios.get(`${ApiServer.USERS}/${this.props.navigation.state.params.user.id}`, this.state.header)
      .then((response) => {
        this.setState({
          loading: false,
          user: response.data.user,
          categories: response.data.categories,
        });
      })
      .catch((error) => {
        console.log(error.response);
      });
  }

  _onRefresh() {
    this.setState({refreshing: true});
    this.apiCall().then(() => {
      this.setState({refreshing: false});
    });
  }

  render() {
    const { preLoading } = BaseStyle;
    const { navigation } = this.props;

    return (
      <Container style={{ backgroundColor: '#FFFFFF' }}>
        <Grid>
          <Content refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }>
            <Row style={{
              height: 250,
              alignItems: 'center',
            }}>
              <Col style={{ alignItems: 'center' }}>
                <UserUnitRound
                  id={this.state.user.id}
                  image_url={this.state.user.image_medium_url}
                  barWidth={130}
                  barHeight={130}
                  borderRadius={65}
                />
                <Text style={{
                  textAlign: 'center',
                  fontSize: 25,
                }} large numberOfLines={1}>{this.state.user.name}</Text>
                <Text note style={{ width: 250, textAlign: 'center' }} numberOfLines={2}>{this.state.user.introduce}</Text>
              </Col>
            </Row>
            <Row>
              <FlatList
                data={this.state.categories}
                style={{paddingBottom: 15}}
                renderItem={({ item }) => (
                  <FivesBar
                    onPress={() => navigation.navigate('UserFiveShow', { user: this.props.navigation.state.params.user, category_data: item, category: item.category, navLoading: true })}
                    category={item.category}
                    followers={item.followers_count}
                    followees={item.followees_count}
                    fives={item.fives}
                    image={Images.findImageOf(item.klass.toLowerCase())}
                  />
                )}
                keyExtractor={item => 'five-category-list-' + item.klass}
              />
            </Row>
          </Content>
        </Grid>
        {this.state.loading &&
        <View style={preLoading}>
          <Spinner size="large"/>
        </View>
        }
      </Container>
    );
  }
}
