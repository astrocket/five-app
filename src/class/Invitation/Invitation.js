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
  Toast,
} from 'native-base';
import {
  Col,
  Row,
  Grid,
} from 'react-native-easy-grid';
import * as Constant from '../../config/Constant';
import BaseStyle from '../../config/BaseStyle';
import { InviteBox } from '../../component/common/InviteBox';
import { observer, inject } from 'mobx-react/native';

@inject('stores') @observer
export default class Invitation extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: '친구초대',
    ...Constant.FiveNavOptions
  });

  constructor(props) {
    super(props);
    this.app = this.props.stores.app;
    this.server = this.props.stores.server;
    this.state = {
      loading: false, //실서비스에서는 로딩 true로
      restaurant_invitations: [
        {
          id: '1',
          status: true,
        }, {
          id: '2',
          status: true,
        }, {
          id: '3',
          status: false,
        },
      ],
    }
    ;
  }

  renderRestaurantInviteBoxes() {
    const restaurant_invitations = this.state.restaurant_invitations;
    return [0,1,2,3,4].map(function (index, i) {
      const restaurant_invitation = restaurant_invitations[index];
      if (restaurant_invitation) {
        return (
          <Col key={i}>
            <InviteBox
              marginLeft={5}
              marginRight={5}
              used
            />
          </Col>
        )
      } else {
        return (
          <Col key={i}>
            <InviteBox
              marginLeft={5}
              marginRight={5}
              onPress={()=> Toast.show({
                text: '카톡 !',
                position: 'bottom',
                duration: 1500
              })}
            />
          </Col>
        )
      }
    })
  }

  render() {
    const { container, preLoading } = BaseStyle;
    const { navigation } = this.props;

    return (
      <Container style={{ backgroundColor: '#FFFFFF' }}>
        <Grid style={{ padding: 10 }}>
          <Row style={{ height: 30 }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
              <Text>맛집 초대장 보내기</Text>
            </View>
          </Row>
          <Row>
            {this.renderRestaurantInviteBoxes()}
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
