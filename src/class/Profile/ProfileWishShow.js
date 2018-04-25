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
import { WishUnitBar, EmptyBox } from '../../component/common';
import * as Constant from '../../config/Constant';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('stores') @observer
export default class ProfileWishShow extends Component {

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
      loading: false, //실서비스에서는 로딩 true로
      klass: this.props.klass,
      category: this.props.category,
      category_korean: this.props.category_korean,
      wishes: this.props.wishes,
    };
  }

  toggleFiveCall(wish_data, index) {
    this.onClickToggleFive(index)
      .then(() => {
        if (wish_data.also_five) {
          this.five.fiveDestroy(this.state.category, wish_data.wish.id, (res) => this.onFiveDestroySuccess(res.data, index));
        } else {
          this.five.fiveCreate(this.state.category, wish_data.wish.id, (res) => this.onFiveCreateSuccess(res.data, index));
        }
      });
  }

  async onClickToggleFive(index) {
    const stateBefore = [ ...this.state.wishes];
    stateBefore[ index ].loading = true;
    await this.setState({ wishes: stateBefore })
  }

  onFiveCreateSuccess(data, index) {
    const stateBefore = [...this.state.wishes];
    stateBefore[index].also_five = true;
    stateBefore[index].loading = false;
    stateBefore[index].wish.five_users_count += 1;
    this.setState({ wishes: stateBefore });
  }

  onFiveDestroySuccess(data, index) {
    const stateBefore = [...this.state.wishes];
    stateBefore[index].also_five = false;
    stateBefore[index].loading = false;
    stateBefore[index].wish.five_users_count -= 1;
    this.setState({ wishes: stateBefore });
  }

  askWishDestroy(secId, rowId, rowMap, item) {
    Alert.alert(
      '삭제 알림',
      '이 아이템을 보관함에서 삭제하시겠어요?',
      [ { text: '아니요', style: 'cancel', },
        { text: 'OK', onPress: () => this.five.wishDestroy(this.state.category, item.wish.id, (res) => this.deleteRow(secId, rowId, rowMap)), }, ],
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
        <Row style={{ height: 12, backgroundColor: '#fafafa' }}>
        </Row>
        <Content onScroll={this.props.onScroll}>
          <Grid>
            <Row>
              {this.state.wishes.length > 0 ?
                <List
                  dataSource={this.ds.cloneWithRows(this.state.wishes)}
                  style={{
                    flex: 1,
                    paddingTop: 2.5,
                  }}
                  renderRow={(data, secId, rowId, rowMap) =>
                    <WishUnitBar
                      onPressImage={() => navigation.navigate('FiveShow', {
                        category: this.state.category,
                        id: data.wish.id,
                        title: data.wish.title,
                      })}
                      onPress={() => this.toggleFiveCall(data, rowId)}
                      id={data.wish.id}
                      title={data.wish.title}
                      subtitle={data.wish.subtitle}
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
                    this.state.wishes[ rowId ] ?
                    <Button full danger onPress={_ => this.askWishDestroy(secId, rowId, rowMap, data)}>
                      <Text>삭제</Text>
                    </Button> : null
                  }
                  leftOpenValue={80}
                  rightOpenValue={-80}
                />
                :<EmptyBox
                  barWidth={Constant.deviceWidth}
                  message={`아직 보관해 둔 아이템이 없어요.`}
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
