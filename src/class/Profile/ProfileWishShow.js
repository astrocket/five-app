import React, { Component } from 'react';
import {
  View, Alert, ListView
} from 'react-native';
import {
  Container, Header, Content, Text, Spinner, Button, List, ListItem, Icon, Toast
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import axios from 'axios';
import { WishUnitBar, EmptyBox } from '../../component/common';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('ApplicationStore') // Inject some or all the stores!
@observer
export default class ProfileWishShow extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: '파이브수정',
    ...Constant.FiveNavOptions,
  });

  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      loading: false, //실서비스에서는 로딩 true로
      headers: {
        headers: {
          'X-User-Email': this.props.ApplicationStore.email,
          'X-User-Token': this.props.ApplicationStore.token
        }
      },
      klass: this.props.klass,
      category: this.props.category,
      category_korean: this.props.category_korean,
      wishes: this.props.wishes,
    };
  }

  componentDidMount() {
  }

  deleteCall(url, data, onSuccess) {
    axios.post(url, data, this.state.header)
      .then((response) => {
        onSuccess(response); // 업로드 후 유저를 통째로 리턴시킨다.
      }).catch((error) => {
      console.log(error.response);
      Toast.show({
        text: JSON.stringify(error.response.data),
        position: 'bottom',
        duration: 1500,
      });
    });
  }

  createFiveCall(category, wish_data, index) {
    const wish = wish_data.wish;
    const data = {
      favorable_id: wish.id,
    };

    if (wish_data.also_five) {
      axios.post(`${ApiServer.MY_PROFILE}/destroy_five?category=${category}`, data, this.state.header)
        .then((response) => {
          this.onDestroyFiveCallSuccess(response.data, index);
        }).catch((error) => {
        console.log(error.response);
        Toast.show({
          text: '에러 : ' + JSON.stringify(error.response.data.errors),
          position: 'bottom',
          duration: 1500,
        });
      });
    } else {
      axios.post(`${ApiServer.MY_PROFILE}/create_five?category=${category}`, data, this.state.header)
        .then((response) => {
          this.onCreateFiveCallSuccess(response.data, index);
        }).catch((error) => {
        console.log(error.response);
        Toast.show({
          text: '에러 : ' + JSON.stringify(error.response.data.errors),
          position: 'bottom',
          duration: 1500,
        });
      });
    }
  }

  onCreateFiveCallSuccess(data, index) {
    const stateBefore = [...this.state.wishes];
    stateBefore[index].also_five = true;
    this.setState({ wishes: stateBefore });
  }

  onDestroyFiveCallSuccess(data, index) {
    const stateBefore = [...this.state.wishes];
    stateBefore[index].also_five = false;
    this.setState({ wishes: stateBefore });
  }

  askRestaurantDelete(secId, rowId, rowMap, item) {
    const url = `${ApiServer.MY_PROFILE}/destroy_wish?category=${this.state.category}`;
    const data = {
      favorable_id: item.wish.id
    };

    Alert.alert(
      '알림',
      '해당 아이템을 삭제하시겠어요?',
      [
        {
          text: '아니요',
          style: 'cancel',
        },
        {
          text: '네',
          onPress: () => this.deleteCall(url, data, (response) => this.deleteRow(secId, rowId, rowMap)),
        },
      ],
      { cancelable: true },
    );
  }

  deleteRow(secId, rowId, rowMap) {
    rowMap[`${secId}${rowId}`].props.closeRow();
    const newData = [...this.state.wishes];
    newData.splice(rowId, 1);
    this.setState({ wishes: newData });
  }

  render() {
    const { container, preLoading } = BaseStyle;
    const { navigation } = this.props;

    return (
      <Container>
        <Content>
          <Grid>
            <Row>
              {this.state.wishes.length > 0 ?
                <List
                  dataSource={this.ds.cloneWithRows(this.state.wishes)}
                  style={{
                    paddingTop: 2.5,
                  }}
                  renderRow={(data, secId, rowId, rowMap) =>
                    <WishUnitBar
                      onPressImage={() => navigation.navigate('FiveShow', {
                        category: this.state.category,
                        id: data.wish.id,
                        title: data.wish.title,
                      })}
                      onPress={() => this.createFiveCall(this.state.category, data, rowId)}
                      id={data.wish.id}
                      title={data.wish.title}
                      subtitle={data.wish.location}
                      image_url={data.wish.image_medium_url}
                      also_five={data.also_five}
                      five_users_count={data.wish.five_users_count}
                    />
                  }
                  disableRightSwipe={true}
                  renderLeftHiddenRow={data =>
                    null
                  }
                  renderRightHiddenRow={(data, secId, rowId, rowMap) =>
                    <Button full danger onPress={_ => this.askRestaurantDelete(secId, rowId, rowMap, data)}>
                      <Icon active name="trash"/>
                    </Button>
                  }
                  leftOpenValue={75}
                  rightOpenValue={-75}
                />
                :<EmptyBox
                  barWidth={Constant.deviceWidth - 20}
                  message={`아직 클립에 담긴 FIVE가 없네요.`}
                  barHeight={100}
                  borderRadius={10}
                  marginRight={0}
                />
              }
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
