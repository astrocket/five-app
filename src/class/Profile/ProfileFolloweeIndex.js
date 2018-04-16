import React, { Component } from 'react';
import {
  View, FlatList, RefreshControl
} from 'react-native';
import {
  Container, Header, Content, Text, Spinner,
  Item, Input, Icon, Button,
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import { FollowUnitBar, EmptyBox } from '../../component/common';
import axios from 'axios';
import {
  UserUnitRound, FivesBar, NavBar,
} from '../../component/common';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('ApplicationStore') // Inject some or all the stores!
@observer
export default class ProfileFolloweeIndex extends Component {

  static navigationOptions = ({ navigation }) => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: false, //실서비스에서는 로딩 true로
      refreshing: false,
      header: {
        headers: {
          'X-User-Email': this.props.ApplicationStore.email,
          'X-User-Token': this.props.ApplicationStore.token,
        },
      },
      category: this.props.navigation.state.params.category,
      followees_followings: [],
      flip: false
    };
  }

  componentDidMount() {
    this.apiCall();
  }

  async apiCall() {
    await axios.get(`${ApiServer.MY_PROFILE}/followees?category=${this.state.category}`, this.state.header)
      .then((response) => {
        console.log(response);
        this.setState({
          loading: false,
          followees_followings: response.data.followees_followings,
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
    const { container, preLoading } = BaseStyle;
    const { navigation } = this.props;

    return (
      <Container>
{/*        <Header searchBar noShadow rounded style={{paddingTop: 0, height: 56 }}>
          <Item>
            <Icon name="ios-search" />
            <Input
              placeholder="Search"
              autoCapitalize={'none'}
              autoCorrect={false}
            />
            <Icon name="ios-people" />
          </Item>
          <Button transparent>
            <Text>검색</Text>
          </Button>
        </Header>*/}
        
        <NavBar
          leftButton
          leftAsImage
          leftIcon={require('../../assets/images/back_icon_pink.png')}
          onPressLeft={() => navigation.goBack()}
          headerText={`내 팔로잉`}
        />

        <Content refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }>
          {this.state.followees_followings.length > 0 ?
            <FlatList
              data={this.state.followees_followings}
              renderItem={({ item }) => (
                <FollowUnitBar
                  user={item.followee}
                  following={item}
                  onPress={() => navigation.navigate('UserShow', {
                    user: item.followee,
                    title: item.followee.name,
                  })}
                />
              )}
              keyExtractor={item => 'followees_followings-list-' + item.id}
            />
          :<EmptyBox
              barWidth={Constant.deviceWidth - 20}
              message={'아직 내가 팔로우 하는 친구가 없어요. 먼저 다른 친구를 팔로우 해보세요.'}
              barHeight={100}
              borderRadius={10}
              marginRight={0}
            />}
        </Content>
        {this.state.loading &&
        <View style={preLoading}>
          <Spinner size="large"/>
        </View>
        }
      </Container>
    )

  }
}
