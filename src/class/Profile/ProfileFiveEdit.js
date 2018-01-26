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
import { FiveUnitBar, EmptyBox } from '../../component/common';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('ApplicationStore') // Inject some or all the stores!
@observer
export default class ProfileFiveEdit extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: '파이브수정',
    ...Constant.FiveNavOptions,
  });

  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      loading: true, //실서비스에서는 로딩 true로
      klass: '',
      category: '',
      fives: [],
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
    axios.get(`${ApiServer.MY_PROFILE}/fives?category=${this.props.navigation.state.params.five_category}`, config)
      .then((response) => {
        this.setState({
          loading: false,
          klass: response.data.klass,
          category: response.data.category,
          fives: response.data.fives,
        });
      })
      .catch((error) => {
        console.log('에러 : ' + error.response);
      });
  }

  deleteCall(url, data, onSuccess) {
    const header = {
      headers: {
        'X-User-Email': this.props.ApplicationStore.email,
        'X-User-Token': this.props.ApplicationStore.token
      }
    };

    axios.post(url, data, header)
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

  askRestaurantDelete(secId, rowId, rowMap, five_data) {
    const url = `${ApiServer.MY_PROFILE}/destroy_five?category=restaurant`;
    const item = this.state.fives[ rowId ];
    const data = {
      favorable_id: item.id
    };

    if (this.state.fives.length <= 1) {
      Alert.alert(
        '알림',
        '1개 이하로 파이브를 삭제할 수 없습니다.',
        [
          {
            text: '확인',
          },
        ],
        { cancelable: true },
      );
      rowMap[`${secId}${rowId}`].props.closeRow();
    } else {
      Alert.alert(
        '알림',
        '해당 파이브를 삭제하시겠어요?',
        [
          {
            text: '네',
            onPress: () => this.deleteCall(url, data, (response) => this.deleteRow(secId, rowId, rowMap)),
            style: 'cancel',
          },
          { text: '아니요' },
        ],
        { cancelable: true },
      );
    }
  }

  deleteRow(secId, rowId, rowMap) {
    rowMap[`${secId}${rowId}`].props.closeRow();
    const newData = [...this.state.fives];
    newData.splice(rowId, 1);
    this.setState({ fives: newData });
  }

  renderFiveUnitBars(data, secId, rowId, rowMap) {
    const navigation = this.props.navigation;
    const item = this.state.fives[ rowId ];

    if (item) {
      return (
        <FiveUnitBar
          key={rowId}
          multiple
          id={item.id}
          title={item.title}
          location={item.location}
          image_url={item.image_medium_url}
          icon={'ios-arrow-forward-outline'}
        />
      )
    } else {
      return (
        <EmptyBox
          key={rowId}
          barWidth={null}
          onPress={() => navigation.navigate('RestaurantNew')}
          barHeight={60}
          borderRadius={10}
          marginRight={0}
        />
      );
    }
  }

  render() {
    const { container, preLoading } = BaseStyle;
    const { navigation } = this.props;

    return (
      <Container>
        <Content>
          <Grid>
            <Row>
              <List
                dataSource={this.ds.cloneWithRows([0,1,2,3,4])}
                style={{
                  paddingTop: 10,
                }}
                renderRow={(data, secId, rowId, rowMap) =>
                  this.renderFiveUnitBars(data, secId, rowId, rowMap)
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
