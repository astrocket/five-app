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
import { FiveUnitBar, EmptyBox, NavBar} from '../../component/common';
import * as Constant from '../../config/Constant';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('stores') @observer
export default class ProfileFiveEdit extends Component {

  static navigationOptions = ({ navigation }) => ({
    header: null
  });

  constructor(props) {
    super(props);
    this.app = this.props.stores.app;
    this.server = this.props.stores.server;
    this.five = this.props.stores.five;
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      loading: true,
      refreshing: false,
      category: this.props.navigation.state.params.category,
      category_korean: this.props.navigation.state.params.category_korean,
      klass: this.props.navigation.state.params.klass,
      fives: [],
    };
  }

  componentDidMount() {
    if (typeof this.props.navigation.state.params.fives === 'undefined') {
      this.server.profileCategoryFive(this.state.category, (res) => {
        this.setState({
          category: res.data.category, klass: res.data.klass, category_korean: res.data.category_korean, fives: res.data.fives
        });
      }).then(() => this.setState({ loading: false }));
    } else {
      this.setState({ fives: this.props.navigation.state.params.fives, loading: false })
    }
  }

  _onRefresh() {
    this.setState({ refreshing: true }, () => {
      this.server.profileCategoryFive(this.state.category, (res) => {
        this.setState({
          category: res.data.category, klass: res.data.klass, category_korean: res.data.category_korean, fives: res.data.fives
        });
      }).then(() => this.setState({ refreshing: false }));
    });
  }

  askFiveDestroy(data, secId, rowId, rowMap) {
    const item = this.state.fives[ rowId ];
    rowMap[`${secId}${rowId}`].props.closeRow();

    if (item) {
      Alert.alert(
        '아이템 삭제 확인',
        '이 아이템을 FIVE에서 삭제하시겠어요? 물론, 삭제해도 보관함에는 남아 있어요.',
        [
          { text: '아니요',
            style: 'cancel'
          },
          {
            text: '네',
            onPress: () => this.five.fiveDestroy(this.state.category, item.id, (res) => {
              this.onFiveDestroy(res, secId, rowId, rowMap)
            }),
          },
        ],
        { cancelable: true },
      );
    }
  }

  onFiveDestroy(res, secId, rowId, rowMap) {
    const newData = [...this.state.fives];
    newData.splice(rowId, 1);
    this.setState({ fives: newData });
  }

  renderFiveList() {
    if (this.state.fives.length > 0 ){
      return (
        <List
          dataSource={this.ds.cloneWithRows([0,1,2,3,4])}
          renderRow={(data, secId, rowId, rowMap) =>
            this.renderFiveUnitBars(data, secId, rowId, rowMap)
          }
          disableRightSwipe={true}
          renderLeftHiddenRow={data =>
            null
          }
          renderRightHiddenRow={(data, secId, rowId, rowMap) =>
            this.state.fives[ rowId ] ?
              <Button full danger onPress={_ => this.askFiveDestroy(data, secId, rowId, rowMap)}>
                <Text>삭제</Text>
              </Button> : null
          }
          leftOpenValue={75}
          rightOpenValue={-75}
        />
      )
    } else {
      return <EmptyBox
        barWidth={Constant.deviceWidth - 20}
        message={`아직 담긴 FIVE가 없네요.`}
        barHeight={100}
        borderRadius={10}
        marginRight={0}
      />;
    }
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
          onPress={() => navigation.navigate(`SearchFive`, {
            category: this.state.category, category_korean: this.state.category_korean, klass: this.state.klass
          })}
          barHeight={60}
          borderRadius={24}
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
        <NavBar
          leftButton
          leftAsImage
          leftIcon={require('../../assets/images/back_icon_pink.png')}
          onPressLeft={() => navigation.goBack()}
          headerText="내 FIVE 관리"
        />
        <Content refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }>
          <Grid>
            <Row style={{ height: 12, backgroundColor: '#fafafa' }}>
            </Row>
            <Row>
              {this.renderFiveList()}
            </Row>
            <Row style={{ height: 12, backgroundColor: '#fafafa' }}>
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
