import React, { Component } from 'react';
import {
  View, FlatList,
} from 'react-native';
import {
  Container, Header, Content, Text, Spinner,
} from 'native-base';
import {
  EmptyBox, SearchUserUnitBar, RowHeaderBar
} from '../../component/common';
import axios from 'axios';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import Contacts from 'react-native-contacts';
import RNOpenSettings from 'react-native-open-setting';
import { observer, inject } from 'mobx-react/native';

@inject('ApplicationStore') // Inject some or all the stores!
@observer
export default class UserContacts extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      header: {
        headers: {
          'X-User-Email': this.props.ApplicationStore.email,
          'X-User-Token': this.props.ApplicationStore.token,
        },
      },
      contact_friends: [],
      permission: false,
    };
  }

  componentDidMount() {
    this.getContacts();
  }

  getContacts() {
    Contacts.getAll((err, contacts) => {
      if (err === 'denied'){
        console.log('4');
        this.setState({ loading: false, permission: false })
      } else {
        console.log('3');
        this.sendToServer(contacts);
      }
    });
  }

  sendToServer(contacts) {
    console.log('5');
    axios.post(`${ApiServer.MY_PROFILE}/device_contacts`, {contacts: contacts}, this.state.header)
      .then((res) => {
        console.log('6');
        this.setState({ contact_friends: res.data, loading: false, permission: true })
      }).catch((err) => {this.setState({ loading: false, permission: false })})
  }

  renderContacts() {
    if (this.state.permission && this.state.contact_friends.length > 0) {
      return (
        <FlatList
          data={this.state.contact_friends}
          renderItem={({ item, index }) => (
            <SearchUserUnitBar
              user={item}
              onPress={() => this.props.navigation.navigate('UserShow', {
                user: item,
                title: item.name,
              })}
            />
          )}
          keyExtractor={item => 'search-user-contact-list-' + item.id}
          ListHeaderComponent={
            <RowHeaderBar
              title={'연락처 친구'}
            />
          }
        />
      );
    } else {
      return (
        <EmptyBox
          barWidth={Constant.deviceWidth - 20}
          onPress={() => RNOpenSettings.openSettings()}
          message={`내 주변 친구들의 취향이 궁금하다면? ${'\n'}여기를 눌러서 연락처를 통해 친구를 찾아보세요.`}
          barHeight={100}
          borderRadius={10}
          marginRight={0}
        />
      )
    }
  }

  render() {
    const { navigation } = this.props;

    if (this.props.showContacts) {
      return (
        this.renderContacts()
      )
    } else {
      return null;
    }
  }
}
