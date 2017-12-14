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
import axios from 'axios';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import ApplicationStore from '../../mobx/ApplicationStore';
import { InviteBox } from '../../component/common/InviteBox';

export default class Invitation extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: '친구초대',
    ...Constant.FiveNavOptions
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: false, //실서비스에서는 로딩 true로
      food_invitations: [
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

  renderFoodInviteBoxes() {
    const food_invitations = this.state.food_invitations;
    return [0,1,2,3,4].map(function (index, i) {
      const food_invitation = food_invitations[index];
      if (food_invitation) {
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
            {this.renderFoodInviteBoxes()}
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
