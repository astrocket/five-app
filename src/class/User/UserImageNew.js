import React, { Component } from 'react';
import {
  View,
} from 'react-native';
import {
  Container,
  Header,
  Content,
  Text,
  Spinner,
  Input,
  Item,
  Toast,
} from 'native-base';
import {
  Col,
  Row,
  Grid,
} from 'react-native-easy-grid';
import {
  UserUnitRound,
} from '../../component/common';
import axios from 'axios';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import ApplicationStore from '../../mobx/ApplicationStore';
import ImagePicker from 'react-native-image-picker';

export default class UserImageNew extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: '한줄 소개',
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
    this.setState({
      user: data,
    });
  }

  postImage(source) {
    //const image_data = new FormData();

    //image_data.append({ image: source.uri }); //Rails 폼 양식에 맞춰서 수정해야함.

    const data = {
      user: {
        image: source.uri,
      }
    };

    Toast.show({
      text: JSON.stringify(data),
      position: 'bottom',
      duration: 1500,
    });

    const header = {
      headers: {
        'X-User-Email': ApplicationStore.email,
        'X-User-Token': ApplicationStore.token
      }
    };

    axios.post(ApiServer.IMAGE_CREATE, data, header)
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
        let source = { uri: response.uri };

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
      <Container style={{
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
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
        {this.state.loading &&
        <View style={preLoading}>
          <Spinner size="large"/>
        </View>
        }
      </Container>
    );
  }
}
