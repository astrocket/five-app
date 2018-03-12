import React, { Component } from 'react';
import {
  View, Platform, Image,
} from 'react-native';
import {
  Container, Header, Content, Text, Spinner, ListItem, List, Left, Body, Thumbnail, Card, CardItem
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import axios from 'axios';
import { NavigationActions } from 'react-navigation';
import { BottomFullButton, MultiToggle } from '../../component/common';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('ApplicationStore') // Inject some or all the stores!
@observer
export default class Hello extends Component {

  static navigationOptions = ({ navigation }) => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      submiting: false,
    };
  }

  renderButton() {
    if (this.state.submiting) {
      return <Spinner size="small" />;
    }

    return (
      <BottomFullButton
        onPress={() =>
        this.props.navigation.dispatch(
          NavigationActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({
                routeName: 'Tutorial',
              }),
            ],
          }))
      }>
        확인
      </BottomFullButton>
    );
  }

  render() {
    const { container, preLoading } = BaseStyle;
    const { navigation } = this.props;

    return (
      <Container>
        <View style={{
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#fff',
          flex: 1,
          paddingTop: Platform.OS === 'ios' ? 20 : 0,
        }}>
          <View style={{
            justifyContent: 'space-around',
            alignItems: 'center',
            flex: 1,
            width: Constant.deviceWidth
          }}>
            <Image
              source={require('../../assets/images/five_logo.png')}
              style={{
                height: (Constant.deviceWidth / 4) + 5,
                width: Constant.deviceWidth / 4,
              }}
            />
            <Text large>회원가입 완료</Text>
          </View>
        </View>
        <View style={{
          flex: 2,
          padding: 20,
          alignSelf: 'stretch',
          backgroundColor: '#fff',
        }}>
          <List>
            <ListItem noBorder style={{ justifyContent: 'center'}}>
              <Text small>앱 접근 권한 안내</Text>
            </ListItem>
            <ListItem avatar>
              <Left>
                <Thumbnail small source={require('../../assets/images/five_logo.png')} />
              </Left>
              <Body style={{ borderBottomWidth: 0 }}>
              <Text normal>알림</Text>
              <Text micro grey>이벤트 및 각종 알림 수신</Text>
              </Body>
            </ListItem>
            <ListItem avatar>
              <Left>
                <Thumbnail small source={require('../../assets/images/five_logo.png')} />
              </Left>
              <Body style={{ borderBottomWidth: 0 }}>
              <Text normal>연락처</Text>
              <Text micro grey>신규 회원 가입 안내 및 팔로우 추천</Text>
              </Body>
            </ListItem>
            <ListItem avatar>
              <Left>
                <Thumbnail small source={require('../../assets/images/five_logo.png')} />
              </Left>
              <Body style={{ borderBottomWidth: 0 }}>
              <Text normal>카메라</Text>
              <Text micro grey>프로필 사진 기타 이미지 촬영</Text>
              </Body>
            </ListItem>
            <ListItem avatar>
              <Left>
                <Thumbnail small source={require('../../assets/images/five_logo.png')} />
              </Left>
              <Body style={{ borderBottomWidth: 0 }}>
              <Text normal>사진첩</Text>
              <Text micro grey>프로필 사진 기타 이미지 등록</Text>
              </Body>
            </ListItem>
            <ListItem noBorder style={{ justifyContent: 'center'}}>
              <Text micro grey>이용자 설정 메뉴를 통해 언제든지 권한 재설정이 가능하며,{'\n'}선택적 접근 권한을 허용하지 않아도 해당 기능 외의 서비스{'\n'}이용은 가능합니다 (정보통신망법에 의한 권한 고지).</Text>
            </ListItem>
          </List>
{/*          <Text note style={{ textAlign: 'center', margin: 20 }}>어서오세요!</Text>
          <Text note style={{ textAlign: 'center', margin: 20 }}>주제별로 다섯개만 공유하는 커뮤니티{'\n'}MYFIVE에 오신 것을 환영합니다.</Text>
          <Text note style={{ textAlign: 'center', margin: 20 }}>이제 좋아하는 주제를 골라서{'\n'}FIVE를 추가하러 가 볼까요?</Text>*/}
        </View>
        <View style={{ height: 50, }}>
          {this.renderButton()}
        </View>
        {this.state.loading &&
        <View style={preLoading}>
          <Spinner size="large"/>
        </View>
        }
      </Container>
    );
  }
}
