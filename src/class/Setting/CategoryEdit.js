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
import axios from 'axios';
import { FiveUnitBar, EmptyBox, DeleteCategory } from '../../component/common';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('ApplicationStore') // Inject some or all the stores!
@observer
export default class CategoryEdit extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: '카테고리 관리',
    ...Constant.FiveNavOptions,
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: false, //실서비스에서는 로딩 true로
      klass: '',
      categories: this.props.navigation.state.params.categories,
    };
  }

  destroyCategory(klass) {
    const header = {
      headers: {
        'X-User-Email': this.props.ApplicationStore.email,
        'X-User-Token': this.props.ApplicationStore.token,
      },
    };

    axios.post(`${ApiServer.MY_PROFILE}/destroy_category`, {
      category: klass.toLowerCase(),
    }, header).then((response) => {
        this.onDestroySuccess(response.data); // 업로드 후 유저를 통째로 리턴시킨다.
      }).catch((error) => {
      Toast.show({
        text: JSON.stringify(error.response),
        position: 'bottom',
        duration: 1500,
      });
    });
  }

  onDestroySuccess(data) {
    this.props.ApplicationStore.setMyProfile(data).then(() => {
      this.setState({
        loading: false,
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
            data={this.state.categories}
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
            keyExtractor={item => 'category-name-list-' + item.id}
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
