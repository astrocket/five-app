import React, { Component } from 'react';
import {
  View, FlatList, RefreshControl
} from 'react-native';
import {
  Container, Header, Content, Text, Spinner,
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import {
  NoticeUnitBar,
} from '../../component/common';
import axios from 'axios';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('ApplicationStore') // Inject some or all the stores!
@observer
export default class NoticeIndex extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: '공지사항',
    ...Constant.FiveNavOptions,
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: false, //실서비스에서는 로딩 true로
      refreshing: false,
      notices: [
        {
          id: 1,
          title: '마이파이브 공지사항 입니다.',
          content: '죽는 날까지 하늘을 우러러\n' +
          '\n' +
          '한 점 부끄럼이 없기를,\n' +
          '\n' +
          '잎새에 이는 바람에도\n' +
          '\n' +
          '나는 괴로워했다.\n' +
          '\n' +
          '별을 노래하는 마음으로\n' +
          '\n' +
          '모든 죽어 가는 것을 사랑해야지.\n' +
          '\n' +
          '그리고 나한테 주어진 길을\n' +
          '\n' +
          '걸어가야겠다.\n' +
          '\n' +
          ' \n' +
          '\n' +
          '오늘 밤에도 별이 바람에 스치운다.',
          created_at: '2017-12-15',
        }, {
          id: 2,
          title: '마이파이브 공지사항 입니다.',
          content: '죽는 날까지 하늘을 우러러\n' +
          '\n' +
          '한 점 부끄럼이 없기를,\n' +
          '\n' +
          '잎새에 이는 바람에도\n' +
          '\n' +
          '나는 괴로워했다.\n' +
          '\n' +
          '별을 노래하는 마음으로\n' +
          '\n' +
          '모든 죽어 가는 것을 사랑해야지.\n' +
          '\n' +
          '그리고 나한테 주어진 길을\n' +
          '\n' +
          '걸어가야겠다.\n' +
          '\n' +
          ' \n' +
          '\n' +
          '오늘 밤에도 별이 바람에 스치운다.',
          created_at: '2017-12-14',
        }, {
          id: 3,
          title: '마이파이브 공지사항 입니다.',
          content: '죽는 날까지 하늘을 우러러\n' +
          '\n' +
          '한 점 부끄럼이 없기를,\n' +
          '\n' +
          '잎새에 이는 바람에도\n' +
          '\n' +
          '나는 괴로워했다.\n' +
          '\n' +
          '별을 노래하는 마음으로\n' +
          '\n' +
          '모든 죽어 가는 것을 사랑해야지.\n' +
          '\n' +
          '그리고 나한테 주어진 길을\n' +
          '\n' +
          '걸어가야겠다.\n' +
          '\n' +
          ' \n' +
          '\n' +
          '오늘 밤에도 별이 바람에 스치운다.',
          created_at: '2017-12-13',
        }, {
          id: 4,
          title: '마이파이브 공지사항 입니다.',
          content: '죽는 날까지 하늘을 우러러\n' +
          '\n' +
          '한 점 부끄럼이 없기를,\n' +
          '\n' +
          '잎새에 이는 바람에도\n' +
          '\n' +
          '나는 괴로워했다.\n' +
          '\n' +
          '별을 노래하는 마음으로\n' +
          '\n' +
          '모든 죽어 가는 것을 사랑해야지.\n' +
          '\n' +
          '그리고 나한테 주어진 길을\n' +
          '\n' +
          '걸어가야겠다.\n' +
          '\n' +
          ' \n' +
          '\n' +
          '오늘 밤에도 별이 바람에 스치운다.',
          created_at: '2017-12-12',
        }, {
          id: 5,
          title: '마이파이브 공지사항 입니다.',
          content: '죽는 날까지 하늘을 우러러\n' +
          '\n' +
          '한 점 부끄럼이 없기를,\n' +
          '\n' +
          '잎새에 이는 바람에도\n' +
          '\n' +
          '나는 괴로워했다.\n' +
          '\n' +
          '별을 노래하는 마음으로\n' +
          '\n' +
          '모든 죽어 가는 것을 사랑해야지.\n' +
          '\n' +
          '그리고 나한테 주어진 길을\n' +
          '\n' +
          '걸어가야겠다.\n' +
          '\n' +
          ' \n' +
          '\n' +
          '오늘 밤에도 별이 바람에 스치운다.',
          created_at: '2017-12-11',
        }, {
          id: 6,
          title: '마이파이브 공지사항 입니다.',
          content: '죽는 날까지 하늘을 우러러\n' +
          '\n' +
          '한 점 부끄럼이 없기를,\n' +
          '\n' +
          '잎새에 이는 바람에도\n' +
          '\n' +
          '나는 괴로워했다.\n' +
          '\n' +
          '별을 노래하는 마음으로\n' +
          '\n' +
          '모든 죽어 가는 것을 사랑해야지.\n' +
          '\n' +
          '그리고 나한테 주어진 길을\n' +
          '\n' +
          '걸어가야겠다.\n' +
          '\n' +
          ' \n' +
          '\n' +
          '오늘 밤에도 별이 바람에 스치운다.',
          created_at: '2017-12-10',
        }, {
          id: 7,
          title: '마이파이브 공지사항 입니다.',
          content: '죽는 날까지 하늘을 우러러\n' +
          '\n' +
          '한 점 부끄럼이 없기를,\n' +
          '\n' +
          '잎새에 이는 바람에도\n' +
          '\n' +
          '나는 괴로워했다.\n' +
          '\n' +
          '별을 노래하는 마음으로\n' +
          '\n' +
          '모든 죽어 가는 것을 사랑해야지.\n' +
          '\n' +
          '그리고 나한테 주어진 길을\n' +
          '\n' +
          '걸어가야겠다.\n' +
          '\n' +
          ' \n' +
          '\n' +
          '오늘 밤에도 별이 바람에 스치운다.',
          created_at: '2017-12-09',
        }, {
          id: 8,
          title: '마이파이브 공지사항 입니다.',
          content: '죽는 날까지 하늘을 우러러\n' +
          '\n' +
          '한 점 부끄럼이 없기를,\n' +
          '\n' +
          '잎새에 이는 바람에도\n' +
          '\n' +
          '나는 괴로워했다.\n' +
          '\n' +
          '별을 노래하는 마음으로\n' +
          '\n' +
          '모든 죽어 가는 것을 사랑해야지.\n' +
          '\n' +
          '그리고 나한테 주어진 길을\n' +
          '\n' +
          '걸어가야겠다.\n' +
          '\n' +
          ' \n' +
          '\n' +
          '오늘 밤에도 별이 바람에 스치운다.',
          created_at: '2017-12-08',
        },
      ],
    };
  }

  async apiCall() {
    const config = {
      headers: {
        'X-User-Email': this.props.ApplicationStore.email,
        'X-User-Token': this.props.ApplicationStore.token,
      },
    };
    await axios.get(ApiServer.HOME_INDEX, config)
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
        <Content refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }>
          <FlatList
            data={this.state.notices}
            renderItem={({ item }) => (
              <NoticeUnitBar
                id={item.id}
                title={item.title}
                content={item.content}
                created_at={item.created_at}
                onPress={() => navigation.navigate('NoticeShow', {
                  title: `공지-${item.id}`,
                  notice: item,
                })}
              />
            )}
            keyExtractor={item => 'notice-list-' + item.id}
          />
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
