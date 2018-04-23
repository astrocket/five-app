import React, { Component } from 'react';
import {
  View, FlatList, RefreshControl,
} from 'react-native';
import {
  Container, Spinner, Content,
} from 'native-base';
import * as Constant from '../../config/Constant';
import BaseStyle from '../../config/BaseStyle';
import { NotificationUnitBar, ShowMore, ElevenHeader, EmptyBox, TabIcon } from '../../component/common';
import { observer, inject } from 'mobx-react/native';

@inject('stores') @observer
export default class TabD extends Component {

  static navigationOptions = ({ navigation, screenProps }) => ({
    tabBarLabel: '소식',
    tabBarIcon: ({ tintColor }) => (
      <TabIcon
        tintColor={tintColor}
        imageGrey={require('../../assets/images/alarm_gray.png')}
        imagePink={require('../../assets/images/alarm_pink.png')}
      />
    ),
    header: null,
    ...Constant.FiveNavOptions,
  });

  constructor(props) {
    super(props);
    this.app = this.props.stores.app;
    this.server = this.props.stores.server;
    this.state = {
      loading: true,
      refreshing: false,
      notifications: [],
      page: 1,
      page_loading: false,
      no_more: false,
      headerShow: true,
    };
  }

  componentDidMount() {
    this.server.notificationIndex(this.state, (data) => this.setState(data))
      .then(() => {
        this.setState({ loading: false })
      });
  }

  _onRefresh() {
    this.setState({ refreshing: true }, () => {
      this.server.notificationIndex(this.state, (data) => this.setState(data))
        .then(() => {
          this.setState({ refreshing: false })
        });
    });
  }

  nextPage() {
    this.setState({
      page: this.state.page + 1,
      page_loading: true,
    }, () => {
      this.server.notificationIndexPaging(this.state, (data) => this.setState(data))
        .then(() => {
          this.setState({ page_loading: false })
        });
    });
  }

  handleScroll(e) {
    var currentOffset = e.nativeEvent.contentOffset.y;
    var headerShow = currentOffset < 100;
    this.setState({ headerShow });
  }

  render() {
    const { container, preLoading } = BaseStyle;
    const { navigation } = this.props;

    return (
      <Container style={{ backgroundColor: '#FFFFFF' }}>
        <ElevenHeader
          headerShow={this.state.headerShow}
          custom
          title={'소식'}
        />
        { this.state.notifications.length > 0 ?
          <FlatList
            data={this.state.notifications}
            style={{
              paddingBottom: 10,
            }}
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
            onScroll={(e) => this.handleScroll(e)}
            renderItem={({ item }) => (
              <NotificationUnitBar
                key={item.id}
                id={item.id}
                user={item.from_user}
                title={item.title}
                created_at={item.created_at}
                onPress={() => navigation.navigate('UserShow', {
                  title: item.from_user.name,
                  user: item.from_user,
                })}
              />
            )}
            keyExtractor={item => 'notifications-list-' + item.id}
            ListFooterComponent={
              () =>
                <ShowMore
                  onPress={() => this.nextPage()}
                  moreText={'더보기'}
                  no_more={this.state.no_more}
                  page_loading={this.state.page_loading}
                />
            }
          />
          : <Content refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
              tintColor={Constant.FiveColor}
            />
          }>
            <EmptyBox
              barWidth={Constant.deviceWidth - 20}
              message={`아직 친구들 소식이 없어요. ${'\n'}친구들을 더 팔로우하고 소식을 받아보세요!`}
              barHeight={100}
              borderRadius={10}
              marginRight={10}
            />
          </Content>
        }
        {this.state.loading &&
        <View style={preLoading}>
          <Spinner size="large"/>
        </View>
        }
      </Container>
    );
  }
}
