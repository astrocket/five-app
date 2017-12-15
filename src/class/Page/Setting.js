import React, { Component } from 'react';
import {
  View,
} from 'react-native';
import {
  Container, Header, Content, List, ListItem, Text, Icon, Left, Body, Right, Switch, H2,
} from 'native-base';

import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import {
  DeleteCategory,
} from '../../component/common';
import axios from 'axios';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import ApplicationStore from '../../mobx/ApplicationStore';

export default class Setting extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.title,
    ...Constant.FiveNavOptions,
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: false, //실서비스에서는 로딩 true로
      user: this.props.navigation.state.params.user,
    };
  }

  componentDidMount() {
    this.apiCall();
  }

  apiCall() {
    const config = {
      headers: {
        'X-User-Email': ApplicationStore.email,
        'X-User-Token': ApplicationStore.token,
      },
    };
    axios.get(ApiServer.HOME_INDEX, config)
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

  render() {
    const { container, preLoading } = BaseStyle;
    const { navigation } = this.props;

    return (
      <Container style={{ backgroundColor: '#FFFFFF' }}>
        <Grid>
          <List style={{
            borderBottomWidth: 1,
            borderBottomColor: '#eee',
          }}>
            <ListItem>
              <Body>
              <Text>자동 팔로우 허용하기</Text>
              </Body>
              <Right>
                <Switch value={true}/>
              </Right>
            </ListItem>
            <ListItem>
              <Body>
              <Text>나의 파이브에 도전 허용하기</Text>
              </Body>
              <Right>
                <Switch value={true}/>
              </Right>
            </ListItem>
            <ListItem button
                      onPress={() => navigation.navigate('UserInfoNew', { user: this.state.user })}>
              <Body>
              <Text>한줄 자기소개 변경하기</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward"/>
              </Right>
            </ListItem>
            <ListItem button
                      onPress={() => navigation.navigate('UserImageNew', { user: this.state.user })}>
              <Body>
              <Text>프로필 사진 변경하기</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward"/>
              </Right>
            </ListItem>
          </List>
          <Row style={{
            justifyContent: 'center',
            alignItems: 'flex-end',
            flex: 1,
          }}>
            <H2 style={{ textAlign: 'center' }}>카테고리 설정</H2>
          </Row>
          <Row style={{
            height: 100,
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginLeft: 10,
            marginRight: 10,
          }}>
            <DeleteCategory
              category={'#맛집'}
              title={'삭제하기'}
              onPress={() => console.log('delete')}
            />
            <DeleteCategory
              category={'#음악'}
              title={'삭제하기'}
              onPress={() => console.log('delete')}
            />
            <DeleteCategory
              category={'#책'}
              title={'삭제하기'}
              onPress={() => console.log('delete')}
            />
          </Row>
        </Grid>
        {this.state.loading &&
        <View style={preLoading}>
          <Spinner size="large"/>
        </View>
        }
      </Container>
    );
  }
}
