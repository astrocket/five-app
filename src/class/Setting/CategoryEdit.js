import React, { Component } from 'react';
import {
  View, FlatList
} from 'react-native';
import {
  Container, Header, Content, Text, Spinner, Button, List, ListItem, Icon, Toast
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import * as Constant from '../../config/Constant';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('stores') @observer
export default class CategoryEdit extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: '카테고리 관리',
    ...Constant.FiveNavOptions,
  });

  constructor(props) {
    super(props);
    this.app = this.props.stores.app;
    this.server = this.props.stores.server;
    this.state = {
      loading: false, //실서비스에서는 로딩 true로
      category: '',
    };
  }

  destroyCategory(category) {
    this.setState({ loading: true }, () => {
      this.server.profileDestroyCategory(category)
        .then(() => {
          this.setState({ loading: false });
        });
    });
  }

  render() {
    const { container, preLoading } = BaseStyle;
    const { navigation } = this.props;

    return (
      <Container>
        <Content padder>
          <FlatList
            data={this.app.categories}
            style={{paddingBottom: 15}}
            renderItem={({ item }) => (
              <Button bordered full danger onPress={() => Toast.show({
                text: '삭제시도(베타이후 작업)',
                position: 'bottom',
                duration: 1500,
              })} style={{ marginBottom: 10 }}>
                <Text>나의 {item.category} 정보 전체 삭제하기</Text>
              </Button>
            )}
            keyExtractor={item => 'category-name-list-' + item.category}
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
