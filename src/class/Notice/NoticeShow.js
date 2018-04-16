import React, { Component } from 'react';
import {
  View,
} from 'react-native';
import {
  Container, Header, Content, Card, CardItem, Text, Body
} from 'native-base';
import {
  Col,
  Row,
  Grid,
} from 'react-native-easy-grid';
import axios from 'axios';
import {
  UserUnitRound, FivesBar, NavBar,
} from '../../component/common';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('ApplicationStore') // Inject some or all the stores!
@observer
export default class NoticeShow extends Component {

  static navigationOptions = ({ navigation }) => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: false, //실서비스에서는 로딩 true로
      notice: this.props.navigation.state.params.notice
    };
  }


  apiCall() {
    const config = {
      headers: {
        'X-User-Email': this.props.ApplicationStore.email,
        'X-User-Token': this.props.ApplicationStore.token,
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
          headerText={navigation.state.params.title}
        />
        <Content padder>
          <Card>
            <CardItem header>
              <Text>{this.state.notice.title}</Text>
            </CardItem>
            <CardItem>
              <Body>
              <Text>
                {this.state.notice.content}
              </Text>
              </Body>
            </CardItem>
            <CardItem footer>
              <Text note>{this.state.notice.created_at.split('T')[0]} by 마이파이브 운영팀</Text>
            </CardItem>
          </Card>
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
