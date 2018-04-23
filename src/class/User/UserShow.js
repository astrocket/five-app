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
import {
  UserUnitRound, FivesBar, NavBar,
} from '../../component/common';
import * as Images from '../../assets/images/Images';
import * as Constant from '../../config/Constant';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('stores') @observer
export default class UserShow extends Component {

  static navigationOptions = ({ navigation }) => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.app = this.props.stores.app;
    this.server = this.props.stores.server;
    this.state = {
      loading: true, //실서비스에서는 로딩 true로
      refreshing: false,
      user: this.props.navigation.state.params.user,
      categories: [],
    };
  }

  componentDidMount() {
    this.server.userShow(this.state.user.id, (res) => {
      this.setState({
        user: res.data.user,
        categories: res.data.categories,
      });
    }).then(() => this.setState({ loading: false }));
  }

  _onRefresh() {
    this.setState({ refreshing: true }, () => {
      this.server.userShow(this.state.id, (res) => {
        this.setState({
          user: res.data.user,
          categories: res.data.categories,
        });
      }).then(() => this.setState({ refreshing: false }));
    });
  }

  toggleFollowCall(item, index) {
    this.onClickFollow(item, index)
      .then(() => {
        const have = this.app.hasCategory(item.category);
        if (have) {
          this.server.followPost(this.state.user.id, item.following, item.category, (res) => this.onSuccessFollow(res, index))
            .then(() => this.afterClickFollow(item, index));
        } else {
          Alert.alert(
            `아직 참여한 카테고리는 아니에요`,
            `${Constant.askToParticipate(item.category_korean, this.state.user.name)}`,
            [ {
              text: '네',
              onPress: () => this.server.followPost(this.state.user.id, item.following, item.category, (res) => this.onSuccessFollow(res, index))
                .then(() => this.afterClickFollow(item, index)
                  .then(() => this.props.navigation.navigate(`SearchFive`, { category: item.category, category_korean: item.category_korean, klass: item.klass})))
            },
              { text: '취소', style: 'cancel', },
            ], { cancelable: true },
          );
        }
      })
  }

  async onClickFollow(item, index) {
    const stateBefore = [ ...this.state.categories ];
    stateBefore[ index ].loading = true;
    await this.setState({ categories: stateBefore })
  }

  async afterClickFollow(item, index) {
    const stateBefore = [ ...this.state.categories ];
    stateBefore[ index ].loading = false;
    await this.setState({ categories: stateBefore })
  }

  onSuccessFollow(res, index) {
    const new_following = res.data;
    const stateBefore = [ ...this.state.categories ];
    stateBefore[ index ].following = new_following;
    this.setState({ categories: stateBefore });
  }

  render() {
    const { preLoading } = BaseStyle;
    const { navigation } = this.props;

    return (
      <Container style={{ backgroundColor: 'white' }}>
        <NavBar
          leftButton
          leftAsImage
          leftIcon={require('../../assets/images/back_icon_pink.png')}
          onPressLeft={() => navigation.goBack()}
          headerText={``}
        />
          <Content refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }>
            <Grid>
            <Row style={{
              height: 280,
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
                  fontFamily: 'montserrat',
                  fontSize: 26,
                  padding: 5
                }} large numberOfLines={1}>{this.state.user.name}</Text>
                <Text note style={{ width: 250, textAlign: 'center', padding: 3, marginBottom: 32 }} numberOfLines={2}>❝ {this.state.user.introduce} ❞</Text>
              </Col>
            </Row>
            <View style={{
              flex: 1,
              flexDirection: 'row',
              height: 12,
              alignItems: 'center',
              backgroundColor: '#fafafa'
            }}>
            </View>
            <View style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#fafafa'
            }}>
              <FlatList
                data={this.state.categories}
                style={{paddingBottom: 15}}
                renderItem={({ item, index }) => (
                  <FivesBar
                    followButton
                    onPressFollow={() => this.toggleFollowCall(item, index)}
                    onPress={() => navigation.navigate('UserFiveShow', { user: this.props.navigation.state.params.user, category_data: item, category: item.category, navLoading: true })}
                    category={item.category}
                    followers={item.followers_count}
                    followees={item.followees_count}
                    clicked={item.following}
                    loading={item.loading}
                    fives={item.fives}
                    image={require('../../assets/images/five_void_grey.png')}
                    fiveImage={Images.findImageOf(item.klass.toLowerCase())}
                  />
                )}
                keyExtractor={item => 'five-category-list-' + item.klass}
              />
            </View>
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
