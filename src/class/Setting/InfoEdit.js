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
import axios from 'axios';
import {
  FivesBar, NavBar,
} from '../../component/common';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import ImagePicker from 'react-native-image-picker';
import { observer, inject } from 'mobx-react/native';

@inject('ApplicationStore') // Inject some or all the stores!
@observer
export default class UserInfoNew extends Component {

  static navigationOptions = ({ navigation }) => ({
    header: null,
  });

  constructor(props) {
    super(props);
    const { my_profile } = this.props.ApplicationStore;
    this.state = {
      loading: false, //실서비스에서는 로딩 true로
      introduce: my_profile.introduce,
      name: my_profile.name,
    };
  }

  postImage(source) {

    const data = new FormData();

    data.append("user[image]", {
      uri: source.uri,
      name: source.name,
      type: source.type,
    });

    const header = {
      headers: {
        'X-User-Email': this.props.ApplicationStore.email,
        'X-User-Token': this.props.ApplicationStore.token,
        'Content-Type': 'multipart/form-data;',
      }
    };

    axios.post(`${ApiServer.MY_PROFILE}/update_user`, data, header)
      .then((response) => {
        this.onUploadSuccess(response.data);
      }).catch((error) => {
      Toast.show({
        text: JSON.stringify(error.response),
        position: 'bottom',
        duration: 1500,
      });
    });
  }

  openImagePicker() {
    const options = {
      title: 'Select Avatar',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else {

        this.setState({
          loading: true,
        });

        let source = {
          uri: response.uri,
          name: response.fileName,
          type: response.type
        };

        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };
        this.postImage(source);
      }
    });
  }

  onUploadSuccess(data) {
    this.props.ApplicationStore.setMyProfile(data).then(() => {
      this.setState({
        loading: false,
      });
    });
  }

  postUserInfo() {
    const header = {
      headers: {
        'X-User-Email': this.props.ApplicationStore.email,
        'X-User-Token': this.props.ApplicationStore.token,
      },
    };

    axios.post(`${ApiServer.MY_PROFILE}/update_user`, {
      user: {
        introduce: this.state.introduce,
        name: this.state.name,
        username: this.state.name,
      }
    }, header)
      .then((response) => {
        this.onUploadSuccess(response.data); // 업로드 후 유저를 통째로 리턴시킨다.
      }).catch((error) => {
      Toast.show({
        text: JSON.stringify(error.response),
        position: 'bottom',
        duration: 1500,
      });
    });
  }

  render() {
    const { container, preLoading } = BaseStyle;
    const { navigation } = this.props;
    const { my_profile } = this.props.ApplicationStore;

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
