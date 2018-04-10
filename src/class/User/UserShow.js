import React, { Component } from 'react';
import {
  View, FlatList, RefreshControl, Alert
} from 'react-native';
import {
  Container, Content, Text, Spinner, Toast,
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import axios from 'axios';
import {
  UserUnitRound, FivesBar, NavBar,
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
    header: null,
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


  askFollowOption(item, index) {
    console.log(JSON.stringify(this.props.ApplicationStore.categories));
    this.props.ApplicationStore.hasCategory(item.category).then((have) => {
      if (have) {
        this.followCall(item, index);
      } else {
        Alert.alert(
          `아직 참여한 카테고리는 아니에요`,
          `${item.state.user.name}님을 팔로우 하고 함께 ${item.category_korean} 카테고리에 참여하러 가시겠어요?`,
          [
            {
              text: '네',
              onPress: () => this.followCall(item, index).then(() => {
                this.props.navigation.navigate(`SearchFive`, {
                  category: item.category,
                  category_korean: item.category_korean,
                  klass: item.klass,
                });
              }),
            },
            {
              text: '취소',
              style: 'cancel',
            },
          ],
          { cancelable: true },
        );
      }
    });
  }

  async followCall(item, index) {
    const data = {
      following: {
        user_id: this.state.user.id,
        following: !item.following,
      },
    };

    const header = {
      headers: {
        'X-User-Email': this.props.ApplicationStore.email,
        'X-User-Token': this.props.ApplicationStore.token,
      },
    };

    await axios.post(`${ApiServer.FOLLOWINGS}/?category=${item.category}`, data, header)
      .then((response) => {
        this.onCreateFollowCallSuccess(response, index); // 업로드 후 유저를 통째로 리턴시킨다.
      }).catch((error) => {
        console.log(error.response);
        Toast.show({
          text: JSON.stringify(error.response.data),
          position: 'bottom',
          duration: 1500,
        });
      });
  }

  onCreateFollowCallSuccess(response, index) {
    const new_following = response.data;
    const stateBefore = [ ...this.state.categories ];
    stateBefore[ index ].following = new_following;
    this.setState({ follow_suggestions: stateBefore });
  }

  render() {
    const { preLoading } = BaseStyle;
    const { navigation } = this.props;

    return (
      <Container style={{ backgroundColor: '#FFFFFF' }}>
        <NavBar
          leftButton
          leftAsImage
          leftIcon={require('../../assets/images/back_icon_pink.png')}
          onPressLeft={() => navigation.goBack()}
          headerText={`${this.state.user.name}의 FIVE`}
        />
          <Content refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }>
            <Grid>
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
                renderItem={({ item, index }) => (
                  <FivesBar
                    followButton
                    onPressFollow={() => this.askFollowOption(item, index)}
                    onPress={() => navigation.navigate('UserFiveShow', { user: this.props.navigation.state.params.user, category_data: item, category: item.category, navLoading: true })}
                    category={item.category}
                    followers={item.followers_count}
                    followees={item.followees_count}
                    clicked={item.following}
                    fives={item.fives}
                    image={require('../../assets/images/five_void_grey.png')}
                    fiveImage={Images.findImageOf(item.klass.toLowerCase())}
                  />
                )}
                keyExtractor={item => 'five-category-list-' + item.klass}
              />
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
