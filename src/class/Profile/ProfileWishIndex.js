import React, { Component } from 'react';
import {
  View, Alert, ListView
} from 'react-native';
import {
  Container, Header, Content, Text, Spinner, Button, List, ListItem, Icon, Tabs, Tab, TabHeading
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import axios from 'axios';
import { FiveUnitBar } from '../../component/common';
import ProfileWishShow from './ProfileWishShow';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('ApplicationStore') // Inject some or all the stores!
@observer
export default class ProfileWishIndex extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: '나의 보관함',
    ...Constant.FiveNavOptions,
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: true, //실서비스에서는 로딩 true로
      categories: [],
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
    axios.get(`${ApiServer.MY_PROFILE}/wishes`, config)
      .then((response) => {
        this.setState({
          loading: false,
          categories: response.data.categories,
        });
      })
      .catch((error) => {
        console.log('에러 : ' + error.response);
      });
  }

  renderCategoryTabs() {
    const { navigation } = this.props;
    return this.state.categories.map(function(category, i) {
      return (
        <Tab key={i} heading={category.category} activeTextStyle={{
          color: Constant.FiveColor,
        }}>
          <ProfileWishShow
            klass={category.klass}
            category={category.category}
            wishes={category.wishes}
            navigation={navigation}
          />
        </Tab>
      )
    });
  }

  render() {
    const { container, preLoading } = BaseStyle;
    const { navigation } = this.props;

    return (
      <Container>
        <Tabs locked tabBarUnderlineStyle={{
          backgroundColor: Constant.FiveColor,
        }}>
          {this.renderCategoryTabs()}
        </Tabs>
        {this.state.loading &&
        <View style={preLoading}>
          <Spinner size="large"/>
        </View>
        }
      </Container>
    );
  }
}
