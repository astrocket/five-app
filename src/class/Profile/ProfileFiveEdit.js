import React, { Component } from 'react';
import {
  View, Alert, ListView, RefreshControl
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
    title: '내 FIVE 관리',
    ...Constant.FiveNavOptions,
  });

  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      loading: true, //실서비스에서는 로딩 true로
      refreshing: false,
      header: {
        headers: {
          'X-User-Email': this.props.ApplicationStore.email,
          'X-User-Token': this.props.ApplicationStore.token,
        },
      },
      category: this.props.navigation.state.params.category,
      klass: '',
      fives: [],
      wishes: []
    };
  }

  componentDidMount() {
    this.apiCall();
  }

  async apiCall() {
    await axios.get(`${ApiServer.MY_PROFILE}/fives?category=${this.state.category}`, this.state.header)
      .then((response) => {
        this.setState({
          loading: false,
          klass: response.data.klass,
          fives: response.data.fives,
          wishes: response.data.wishes
        });
      })
      .catch((error) => {
        console.log('에러 : ' + error.response);
      });
  }

  _onRefresh() {
    this.setState({refreshing: true});
    this.apiCall().then(() => {
      this.setState({refreshing: false});
    });
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

  askRestaurantDelete(secId, rowId, rowMap, five_data) {
    const url = `${ApiServer.MY_PROFILE}/destroy_five?category=${this.state.category}`;
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
        '해당 파이브를 삭제하시겠어요?',
        '삭제해도 클립 리스트에서 확인할 수 있습니다.',
        [
          { text: '아니요',
            style: 'cancel'
          },
          {
            text: '네',
            onPress: () => this.deleteCall(url, data, (response) => this.deleteRow(secId, rowId, rowMap)),
          },
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
          friends_info={`FIVE ${item.five_users_count}`}
          subtitle={item.subtitle}
          image_url={item.image_medium_url}
          new_label={item.new_label}
        />
      )
    } else {
      return (
        <EmptyBox
          key={rowId}
          barWidth={null}
          onPress={() => navigation.navigate(`ProfileFiveAdd${this.state.klass}`, {
            category: this.state.category, klass: this.state.klass, wishes: this.state.wishes
          })}
          barHeight={50}
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
        <Content refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }>
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
                leftOpenValue={60}
                rightOpenValue={-60}
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
