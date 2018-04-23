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
  NoticeUnitBar, EmptyBox
} from '../../component/common';
import {
  NavBar,
} from '../../component/common';
import * as Constant from '../../config/Constant';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('stores') @observer
export default class NoticeIndex extends Component {

  static navigationOptions = ({ navigation }) => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.app = this.props.stores.app;
    this.server = this.props.stores.server;
    this.state = {
      loading: true,
      refreshing: false,
      notices: [],
    };
  }

  componentDidMount() {
    this.server.homeNotice((data) => this.setState(data)).then(() => {
      this.setState({ loading: false });
    });
  }

  _onRefresh() {
    this.setState({ refreshing: true }, () => {
      this.server.homeNotice((data) => this.setState(data)).then(() => {
        this.setState({ refreshing: false });
      });
    });
  }

  render() {
    const { container, preLoading } = BaseStyle;
    const { navigation } = this.props;

    return (
      <Container>
       <NavBar
          leftButton
          leftAsImage
          leftIcon={require('../../assets/images/back_icon_pink.png')}
          onPressLeft={() => navigation.goBack()}
          headerText={`공지사항`}
        />
        <Content refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }>
          {this.state.notices.length > 0 ?
            <FlatList
              data={this.state.notices}
              renderItem={({ item }) => (
                <NoticeUnitBar
                  id={item.id}
                  title={item.title}
                  content={item.content}
                  onPress={() => navigation.navigate('NoticeShow', {
                    title: `${item.title}`,
                    notice: item,
                  })}
                />
              )}
              keyExtractor={item => 'notice-list-' + item.id}
            />
          :<EmptyBox
              barWidth={Constant.deviceWidth - 20}
              message={`아직 공지사항이 없습니다.`}
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
    );
  }
}
