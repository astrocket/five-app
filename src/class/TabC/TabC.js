import React, { Component } from 'react';
import {
  TabIcon,
} from '../../component/common';
import SearchUser from '../Search/SearchUser';
import * as Constant from '../../config/Constant';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('stores') @observer
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
    this.app = this.props.stores.app;
    this.server = this.props.stores.server;
    this.state = {
      suggestions: [],
      loading: true,
    }
  }

  componentDidMount() {
    this.server.userSuggestions((data) => this.setState(data))
      .then(() => this.setState({ loading: false }));
  }

  render () {
    return (
      <SearchUser navigation={this.props.navigation} suggestions={this.state.suggestions} loading={this.state.loading} />
    );
  }
}