import React, { Component } from 'react';
import {
  View,
} from 'react-native';
import {
  Container, Spinner, Tabs, Tab,
} from 'native-base';
import axios from 'axios';
import { EmptyBox } from '../../component/common';
import ProfileWishShow from './ProfileWishShow';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('ApplicationStore') // Inject some or all the stores!
@observer
export default class ProfileWishIndex extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: '나의 클립함',
    ...Constant.FiveNavOptions,
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: true, //실서비스에서는 로딩 true로
      header: {
        headers: {
          'X-User-Email': this.props.ApplicationStore.email,
          'X-User-Token': this.props.ApplicationStore.token,
        },
      },
      categories: [],
    };
  }

  componentDidMount() {
    this.apiCall();
  }

  apiCall() {
    axios.get(`${ApiServer.MY_PROFILE}/wishes`, this.state.header)
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
    return this.state.categories.map(function(each_category, i) {
      const { klass, category, category_korean, wishes} = each_category;
      return (
        <Tab key={i} heading={category_korean} activeTextStyle={{
          color: Constant.FiveColor,
        }}>
          <ProfileWishShow
            klass={klass}
            category={category}
            category_korean={category_korean}
            wishes={wishes}
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
      <Container style={{ backgroundColor: '#FFFFFF' }}>
        {this.state.categories.length > 0 ?
          <Tabs locked tabBarUnderlineStyle={{
            backgroundColor: Constant.FiveColor,
          }}>
            {this.renderCategoryTabs()}
          </Tabs>
          : <EmptyBox
            barWidth={Constant.deviceWidth - 20}
            message={`아직 담긴 클립이 없으시네요. ${'\n'} 나만의 FIVE들을 찾아서 보관해보세요.`}
            barHeight={100}
            borderRadius={10}
            marginRight={0}
          />
        }
        {this.state.loading &&
        <View style={preLoading}>
          <Spinner size="large"/>
        </View>
        }
      </Container>
    );
  }
}
