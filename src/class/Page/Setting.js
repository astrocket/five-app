import React, { Component } from 'react';
import {
  View,
} from 'react-native';
import {
  Container, Header, Content, List, ListItem, Text, Icon, Left, Body, Right, Switch, H2, Toast,
  Spinner,
} from 'native-base';

import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import {
  DeleteCategory, UserUnitRound,
} from '../../component/common';
import axios from 'axios';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import ApplicationStore from '../../mobx/ApplicationStore';
import ImagePicker from 'react-native-image-picker';

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

  onUploadSuccess(data) {
    this.updateUser(data)
  }

  updateUser(data) {
    this.props.navigation.state.params.updateUser(data);
    this.setState({
      user: data,
      loading: false,
    });
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
        'X-User-Email': ApplicationStore.email,
        'X-User-Token': ApplicationStore.token,
        'Content-Type': 'multipart/form-data;',
      }
    };

    axios.post(`${ApiServer.MY_PROFILE}/update_user`, data, header)
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
                      onPress={() => navigation.navigate('UserInfoNew', {
                        user: this.state.user,
                        updateUser: (user) => this.updateUser(user)
                      })}>
              <Body>
              <Text>한줄 자기소개 변경하기</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward"/>
              </Right>
            </ListItem>
          </List>
          <Row style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
          }}>
            <Col style={{ alignItems: 'center' }}>
              <UserUnitRound
                id={this.state.user.id}
                name={this.state.user.name}
                image_url={this.state.user.image_url}
                onPress={() => this.openImagePicker()}
                barWidth={70}
                barHeight={70}
                borderRadius={35}
                marginRight={10}
                fontSize={20}
              />
              <Text note>{this.state.user.introduce}</Text>
            </Col>
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
