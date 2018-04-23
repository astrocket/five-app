import React, { Component } from 'react';
import {
  View,
} from 'react-native';
import {
  Container, Header, Content, Text, Spinner, Input, Item, Button,
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import { UserUnitRound, InputSingle } from '../../component/common/index';
import {
  NavBar,
} from '../../component/common';
import * as Constant from '../../config/Constant';
import BaseStyle from '../../config/BaseStyle';
import ImagePicker from 'react-native-image-picker';
import { observer, inject } from 'mobx-react/native';

@inject('stores') @observer
export default class UserInfoNew extends Component {

  static navigationOptions = ({ navigation }) => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.app = this.props.stores.app;
    this.server = this.props.stores.server;
    this.state = {
      loading: false, //실서비스에서는 로딩 true로
      user: {
        name: this.app.my_profile.name,
        username: this.app.my_profile.username,
        introduce: this.app.my_profile.introduce
      }
    };
  }

  postImage(source) {
    const data = new FormData();
    data.append("user[image]", {
      uri: source.uri, name: source.name, type: source.type,
    });
    this.server.profileUpdate(data, (data) => this.setState(data), 'form')
      .then(() => this.setState({ loading: false }))
  }

  openImagePicker() {
    const options = {
      title: '프로필 사진 선택하기',
      storageOptions: {
        skipBackup: true, path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        this.setState({ loading: true }, () => {
          let source = { uri: response.uri, name: response.fileName, type: response.type };
          this.postImage(source);
        });
      }
    });
  }

  postUserInfo() {
    const data = {
      user: {
        name: this.state.name,
        username: this.state.username,
        introduce: this.state.introduce
      }
    };
    this.setState({ loading: true }, () => {
      this.server.profileUpdate(data, (data) => this.setState(data))
        .then(() => this.setState({ loading: false }));
    });
  }

  render() {
    const { container, preLoading } = BaseStyle;
    const { navigation } = this.props;
    const { my_profile } = this.app;

    return (
      <Container>
       <NavBar
          leftButton
          leftAsImage
          leftIcon={require('../../assets/images/back_icon_pink.png')}
          onPressLeft={() => navigation.goBack()}
          headerText={`내 프로필 변경`}
        />
        <Content padder>
          <Grid>
            <Row style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: 240,
              marginBottom: 20,
            }}>
              <Col style={{ alignItems: 'center' }}>
                <UserUnitRound
                  id={my_profile.id}
                  name={my_profile.name}
                  image_url={my_profile.image_medium_url}
                  onPress={() => this.openImagePicker()}
                  barWidth={110}
                  barHeight={110}
                  borderRadius={55}
                  marginRight={0}
                  fontSize={22}
                />
                <Text note style={{ width: 250, textAlign: 'center', padding: 8 }}>{my_profile.introduce}</Text>
              </Col>
            </Row>
            <Row style={{ marginBottom: 5 }}>
              <Text small>  닉네임 변경</Text>
            </Row>
            <Row style={{ marginBottom: 10 }}>
              <InputSingle
                placeholder={my_profile.name}
                submitText={'확인'}
                autoFocus={true}
                defaultValue={my_profile.name}
                onChangeText={(name) => this.setState({ name })}
                onSubmitPress={() => this.postUserInfo()}
                onSubmitEditing={() => this.postUserInfo()}
                returnKeyType={'done'}
              />
            </Row>
            <Row style={{ justifyContent: 'flex-end', marginBottom: 15 }}>
              <Text note style={{ textAlign: 'right', fontSize: 12 }}>영문과 숫자 3~10자로 정해 주세요</Text>
            </Row>
            <Row style={{ marginBottom: 5 }}>
              <Text small>  자기 소개 변경</Text>
            </Row>
            <Row style={{ marginBottom: 10 }}>
              <InputSingle
                placeholder={my_profile.introduce}
                submitText={'확인'}
                autoFocus={false}
                defaultValue={my_profile.introduce}
                onChangeText={(introduce) => this.setState({ introduce })}
                onSubmitPress={() => this.postUserInfo()}
                onSubmitEditing={() => this.postUserInfo()}
                returnKeyType={'done'}
              />
            </Row>
            <Row style={{ justifyContent: 'flex-end', marginBottom: 15 }}>
              <Text note style={{ textAlign: 'right', fontSize: 12 }}>다른 이용자에게는 두 줄까지만 보입니다</Text>
            </Row>
          </Grid>
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
