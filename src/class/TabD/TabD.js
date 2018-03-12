import React, { Component } from 'react';
import {
  View, Platform, Dimensions, FlatList,
} from 'react-native';
import {
  Container, Header, Content, Text, Spinner,
  Item, Input, Icon, Button, Toast, Left, Body, Right, Title,
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
import { NotificationUnitBar, ShowMore, ElevenHeader } from '../../component/common';
import { observer, inject } from 'mobx-react/native';

@inject('ApplicationStore') // Inject some or all the stores!
@observer
export default class TabD extends Component {

  static navigationOptions = ({ navigation, screenProps }) => ({
    tabBarLabel: '소식',
    tabBarIcon: ({ tintColor }) => (
      <View style={{ height: 30 }}>
        <Icon
          name="md-megaphone"
          style={{
            fontSize: 25,
            color: tintColor,
          }}
        />
        {/*{navigation.state.params.noticeCount ?
         <View style={{
            position:'absolute',
            top:-3,
            right:-10,
            minWidth:20,
            height:20,
            borderRadius:15,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: Constant.FiveColor,
          }}><Text micro style={{color: '#FFF', textAlign: 'center'}}>{screenProps.noticeCount}</Text>
         </View> : null
        }*/}
      </View>
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
      <Container>
        <ElevenHeader
          headerShow={this.state.headerShow}
          title={'소식'}
        />
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
        {this.state.loading &&
        <View style={preLoading}>
          <Spinner size="large"/>
        </View>
        }
      </Container>
    );
  }
}
