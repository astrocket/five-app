import React, { Component } from 'react';
import {
  View, Image, Alert, FlatList, RefreshControl
} from 'react-native';
import {
  Container, Header, Content, Text, Spinner,
  Card, CardItem, Thumbnail, Button, Icon, Left,
  Body, Right, H1, Toast, ListItem, ActionSheet,
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import {
  FiveUnitBar, FiveUnitFull,
} from '../../component/common';
import { FollowSmallButton } from '../../component/common';
import axios from 'axios';
import { NavigationActions } from 'react-navigation';
import * as Images from '../../assets/images/Images';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('ApplicationStore') // Inject some or all the stores!
@observer
export default class ProfileFiveIndex extends Component {

  static navigationOptions = ({ navigation }) => ({
    headerRight: (
      navigation.state.params.navLoading ?
        null :
        <View style={BaseStyle.headerDoubleIconsContainer}>
          <Button onPress={navigation.state.params.openShareActionSheet} transparent>
            <Icon
              name="ios-share-outline"
              style={{
                fontSize: 25,
                color: Constant.FiveColor,
              }}
            />
          </Button>
        </View>
    ),
    ...Constant.FiveNavOptions,
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: true, //실서비스에서는 로딩 true로
      refreshing: false,
      flip: false,
      clicked: false,
      fives: [],
      followers_count: '',
      followees_count: '',
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({
      openShareActionSheet: () => this.openShareActionSheet(),
      toggleFollow: () => this.toggleFollow(),
    });
    this.apiCall();
  }

  async apiCall() {
    const config = {
      headers: {
        'X-User-Email': this.props.ApplicationStore.email,
        'X-User-Token': this.props.ApplicationStore.token,
      },
    };
    await axios.get(`${ApiServer.MY_PROFILE}/fives?category=${this.props.navigation.state.params.five_category}`, config)
      .then((response) => {
        this.setState({
          loading: false,
          klass: response.data.klass,
          category: response.data.category,
          fives: response.data.fives,
          followers_count: response.data.followers_count,
          followees_count: response.data.followees_count,
        });
      })
      .catch((error) => {
        console.log('에러 : ' + error.response);
      });
  }

  _onRefresh() {
    this.setState({refreshing: true});
    this.apiCall().then(() => {
      this.setState({refreshing: false});
    });
  }

  openShareActionSheet() {
    const BUTTONS = [ '카카오톡 공유하기', 'Cancel' ];
    const CANCEL_INDEX = 1;

    ActionSheet.show(
      {
        options: BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
      },
      buttonIndex => this.shareAction(BUTTONS[buttonIndex]),
    );
  }

  shareAction(value) {
    Toast.show({
      text: value,
      position: 'bottom',
      duration: 1500
    })
  }

  flipCard() {
    this.setState({
      flip: !this.state.flip,
    });
  }

  renderFlipButton(flip) {
    if (flip) {
      return (
        <Button onPress={() => this.flipCard()} transparent>
          <Icon
            name="md-photos"
            style={{
              fontSize: 25,
              color: '#000',
            }}
          />
        </Button>
      );
    } else {
      return (
        <Button onPress={() => this.flipCard()} transparent>
          <Icon
            name="md-reorder"
            style={{
              fontSize: 25,
              color: '#000',
            }}
          />
        </Button>
      );
    }
  }

  renderCard(flip) {
    const { rowWrapper } = BaseStyle;
    const { navigation } = this.props;

    if (flip) {
      return (
        <Row key={1}>
          <FlatList
            data={this.state.fives}
            renderItem={({ item }) => (
              <FiveUnitBar
                id={item.id}
                title={item.title}
                subtitle={item.subtitle}
                friends_info={`FIVE ${item.five_users_count}`}
                image_url={item.image_medium_url}
                onPress={() => navigation.navigate(`${this.state.klass}Show`, {
                  title: item.title,
                  id: item.id,
                  navLoading: true,
                })}
                new_label={item.new_label}
              />
            )}
            keyExtractor={item => 'five-bar-list-' + item.id}
          />
        </Row>
      );
    } else {
      return (
        <Row key={2}>
          <FlatList
            horizontal
            data={this.state.fives}
            style={rowWrapper}
            renderItem={({ item }) => (
              <FiveUnitFull
                multiple
                id={item.id}
                subtitle={item.subtitle}
                title={item.title}
                image_url={item.image_large_url}
                onPress={() => navigation.navigate(`${this.state.klass}Show`, {
                  title: item.title,
                  id: item.id,
                  navLoading: true,
                })}
                borderRadius={15}
                marginRight={10}
                cardCut={80}
              />
            )}
            keyExtractor={item => 'five-full-list-' + item.id}
          />
        </Row>
      );
    }
  }

  render() {
    const { container, preLoading } = BaseStyle;
    const { navigation } = this.props;
    const { my_profile } = this.props.ApplicationStore;

    return (
      <Container>
        <Content refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }>
          <Grid>
            <Row style={{
              flexDirection: 'column',
              padding: 10,
            }}>
              <Text style={{ marginBottom: 5 }}>{my_profile.name}의</Text>
              <Text large>{this.state.category} 파이브</Text>
            </Row>
            <Row style={{
              paddingBottom: 10,
              marginBottom: 5,
            }}>
              <Col size={2} style={{ justifyContent: 'center' }}>
                <View style={{ flexDirection: 'row' }}>
                  <Button transparent style={{
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    marginRight: 5,
                  }} onPress={() => navigation.navigate('ProfileFollowerIndex', { five_category: navigation.state.params.five_category })}>
                    <Text small
                          style={{ marginRight: 0 }}>{Number(this.state.followers_count).toLocaleString()}</Text>
                    <Text note>{'Follower'}</Text>
                  </Button>
                  <Button transparent style={{
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    marginRight: 5,
                  }} onPress={() => navigation.navigate('ProfileFolloweeIndex', { five_category: navigation.state.params.five_category })}>
                    <Text small
                          style={{ marginRight: 0 }}>{Number(this.state.followees_count).toLocaleString()}</Text>
                    <Text note>{'Following'}</Text>
                  </Button>
                </View>
              </Col>
              <Col size={1} style={{ justifyContent: 'flex-end', flexDirection: 'row'}}>
                <View>
                  <Button onPress={() => navigation.navigate('ProfileFiveEdit', { five_category: navigation.state.params.five_category })} transparent>
                    <Icon
                      name="md-create"
                      style={{
                        fontSize: 25,
                        color: Constant.FiveColor,
                      }}
                    />
                  </Button>
                </View>
                <View style={{ width: 50 }}>
                  {this.renderFlipButton(this.state.flip)}
                </View>
              </Col>
            </Row>
            {this.renderCard(this.state.flip)}
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
