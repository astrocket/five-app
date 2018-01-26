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
import ImagePicker from 'react-native-image-picker';
import { observer, inject } from 'mobx-react/native';

@inject('ApplicationStore') // Inject some or all the stores!
@observer
export default class Setting extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: '설정',
    ...Constant.FiveNavOptions,
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: true, //실서비스에서는 로딩 true로
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
    axios.get(`${ApiServer.MY_PROFILE}/me`, config)
      .then((response) => {
        this.props.ApplicationStore.setMyProfile(response.data).then(() => {
          this.setState({
            loading: false,
          });
        });
      })
      .catch((error) => {
        console.log(error.response);
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
        'X-User-Email': this.props.ApplicationStore.email,
        'X-User-Token': this.props.ApplicationStore.token,
        'Content-Type': 'multipart/form-data;',
      }
    };

    axios.post(`${ApiServer.MY_PROFILE}/update_user`, data, header)
      .then((response) => {
        this.props.ApplicationStore.setMyProfile(response.data).then(() => {
          this.setState({
            loading: false,
          });
        }); // 업로드 후 유저를 통째로 리턴시킨다.
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
    const { my_profile } = this.props.ApplicationStore;

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
                        user: my_profile,
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
                id={my_profile.id}
                name={my_profile.name}
                image_url={my_profile.image_medium_url}
                onPress={() => this.openImagePicker()}
                barWidth={70}
                barHeight={70}
                borderRadius={35}
                marginRight={10}
                fontSize={20}
              />
              <Text note>{my_profile.introduce}</Text>
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
