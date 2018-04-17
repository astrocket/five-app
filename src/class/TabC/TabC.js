import React, { Component } from 'react';
import {
  TabIcon,
} from '../../component/common';
import axios from 'axios';
import SearchUser from '../Search/SearchUser';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('ApplicationStore') // Inject some or all the stores!
@observer
export default class TabC extends Component {

  static navigationOptions = ({ navigation }) => ({
    tabBarLabel: '친구찾기',
    tabBarIcon: ({ tintColor }) => (
      <TabIcon
        tintColor={tintColor}
        imageGrey={require('../../assets/images/search_icon_grey.png')}
        imagePink={require('../../assets/images/search_icon_pink.png')}
      />
    ),
    header: null,
  });

  constructor(props) {
    super(props);
    this.state = {
      suggestions: [],
      loading: true,
      header: {
        headers: {
          'X-User-Email': this.props.ApplicationStore.email,
          'X-User-Token': this.props.ApplicationStore.token,
        },
      },
    }
  }

  componentDidMount() {
    this.apiCall();
  }

  apiCall() {
    axios.get(`${ApiServer.USERS}/suggestions`, this.state.header)
      .then((res) => {
        this.setState({
          suggestions: res.data,
          loading: false
        })
      }).catch((e) => console.log(e.response));
  }

  render () {
    const { container, preLoading } = BaseStyle;

    return (
      <SearchUser navigation={this.props.navigation} suggestions={this.state.suggestions} loading={this.state.loading} />
    );
  }
}