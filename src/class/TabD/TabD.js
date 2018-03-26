import React, { Component } from 'react';
import {
  View, FlatList,
} from 'react-native';
import {
  Container, Spinner, Icon
} from 'native-base';
import axios from 'axios';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import { NotificationUnitBar, ShowMore, ElevenHeader, EmptyBox } from '../../component/common';
import { observer, inject } from 'mobx-react/native';

@inject('ApplicationStore') // Inject some or all the stores!
@observer
export default class TabD extends Component {

  static navigationOptions = ({ navigation, screenProps }) => ({
    tabBarLabel: '소식',
    tabBarIcon: ({ tintColor }) => (
      <Icon
        name="md-megaphone"
        style={{
          fontSize: 25,
          color: tintColor,
        }}
      />
    ),
    header: null,
    ...Constant.FiveNavOptions,
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: true, //실서비스에서는 로딩 true로
      notifications: [],
      page: 1,
      page_loading: false,
      no_more: false,
      headerShow: true,
    };
  }

  componentDidMount() {
    this.apiCall();
  }

  apiCall() {
    const config = {
      headers: {
        'X-User-Email': this.props.ApplicationStore.email,
        'X-User-Token': this.props.ApplicationStore.token,
      },
    };
    axios.get(`${ApiServer.NOTIFICATIONS}?page=${this.state.page}`, config)
      .then((response) => {
        this.props.navigation.setParams({
          noticeCount: 30
        });
        this.setState({
          loading: false,
          notifications: response.data.notifications,
          no_more: response.data.no_more
        });
      })
      .catch((error) => {
        console.log(error.response);
      });
  }

  pageCall() {
    const config = {
      headers: {
        'X-User-Email': this.props.ApplicationStore.email,
        'X-User-Token': this.props.ApplicationStore.token,
      },
    };
    axios.get(`${ApiServer.NOTIFICATIONS}?page=${this.state.page}`, config)
      .then((response) => {
        if (response.data.no_more) {
          this.setState({ no_more: true });
        } else {
          this.setState({
            notifications: [ ...this.state.notifications, ...response.data.notifications ],
            no_more: response.data.no_more,
            page_loading: false,
          });
        }
      }).catch((error) => {
      console.log(error.response);
    });
  }

  nextPage() {
    this.setState({
      page: this.state.page + 1,
      page_loading: true,
    }, () => {
      this.pageCall();
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
          title={'소식'}
        />
        { this.state.notifications.length > 0 ?
          <FlatList
            data={this.state.notifications}
            style={{
              paddingBottom: 10,
            }}
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
          :<EmptyBox
            barWidth={Constant.deviceWidth - 20}
            message={`아직 담은 소식이 없으시네요. ${'\n'} 친구들을 팔로우하고 소식을 받아보세요`}
            barHeight={100}
            borderRadius={10}
            marginRight={0}
          />
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
