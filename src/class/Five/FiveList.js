import React, { Component } from 'react';
import {
  View, FlatList, RefreshControl,
} from 'react-native';
import {
  Container, Content, Spinner,
} from 'native-base';
import { FiveUnitBar, ShowMore } from '../../component/common';
import * as Constant from '../../config/Constant';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';
import { EmptyBox, NavBar } from '../../component/common';

import Icon from 'react-native-vector-icons/FontAwesome';

@inject('stores') @observer
export default class FiveList extends Component {

  static navigationOptions = ({ navigation }) => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.app = this.props.stores.app;
    this.server = this.props.stores.server;
    this.five = this.props.stores.five;
    this.state = {
      loading: true, //실서비스에서는 로딩 true로
      category: this.props.navigation.state.params.category,
      category_korean: Constant.CategoryToKorean(this.props.navigation.state.params.category),
      refreshing: false,
      fives: [],
      page: 1,
      page_loading: false,
      no_more: false,
      search_params: this.props.navigation.state.params.search_params ? this.props.navigation.state.params.search_params : '',
    };
  }

  componentDidMount() {
    this.five.fiveList(this.state.category, this.state.search_params, this.state.page, (res) => {
      this.setState({ fives: res.data.fives, no_more: res.data.no_more });
    }).then(() => this.setState({ loading: false }))
  }

  _onRefresh() {
    this.setState({ refreshing: true, page: 1 }, () => {
      this.five.fiveList(this.state.category, this.state.search_params, this.state.page, (res) => {
        this.setState({ fives: res.data.fives, no_more: res.data.no_more });
      }).then(() => this.setState({ refreshing: false }))
    });
  }

  nextPage() {
    this.setState({ page: this.state.page + 1, page_loading: true, }, () => {
      this.five.fiveList(this.state.category, this.state.search_params, this.state.page, (res) => {
        if (res.data.no_more) {
          this.setState({ no_more: true });
        }
        this.setState({
          fives: [ ...this.state.fives, ...res.data.fives ],
        });
      }).then(() => this.setState({ page_loading: false }));
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
        <Content refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }>
          <FlatList
            data={this.state.fives}
            style={{
              padding: 6,
            }}
            renderItem={({ item }) => (
              <FiveUnitBar
                multiple
                id={item.id}
                title={item.title}
                subtitle={item.subtitle}
                friends_info={item.friends_info}
                image_url={item.image_medium_url}
                onPress={() => this.props.navigation.navigate('FiveShow', {
                  category: item.category,
                  title: item.title,
                  id: item.id,
                  navLoading: true,
                })}
              />
            )}
            keyExtractor={item => 'five-list-' + item.id}
            ListFooterComponent={
              () =>
                <ShowMore
                  onPress={() => this.nextPage()}
                  moreText={'더보기'}
                  overText={'끝'}
                  no_more={this.state.no_more}
                  page_loading={this.state.page_loading}
                />
            }
          />
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
