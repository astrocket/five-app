import React, { Component } from 'react';
import {
  View, FlatList, RefreshControl,
} from 'react-native';
import {
  Container,
  Header,
  Content,
  Text,
  Spinner,
  Button,
} from 'native-base';
import {
  Col,
  Row,
  Grid,
} from 'react-native-easy-grid';
import { FiveUnitBar, ShowMore } from '../../component/common';
import RestaurantShow from './RestaurantModal';
import axios from 'axios';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('ApplicationStore') // Inject some or all the stores!
@observer
export default class RestaurantList extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: '새로 선정된 맛집',
    ...Constant.FiveNavOptions,
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: true, //실서비스에서는 로딩 true로
      refreshing: false,
      restaurants: [],
      page: 1,
      page_loading: false,
      no_more: false,
      search_params: this.props.navigation.state.params.search_params ? this.props.navigation.state.params.search_params : '',
    };
  }

  componentDidMount() {
    this.apiCall();
  }

  async apiCall() {
    const config = {
      headers: {
        'X-User-Email': this.props.ApplicationStore.email,
        'X-User-Token': this.props.ApplicationStore.token,
      },
    };
    await axios.get(`${ApiServer.RESTAURANTS}/list?page=${this.state.page}&s=${this.state.search_params}`, config)
      .then((response) => {
        this.setState({
          loading: false,
          restaurants: response.data,
        });
      })
      .catch((error) => {
        console.log(error.response);
      });
  }

  _onRefresh() {
    this.setState({refreshing: true, page: 1});
    this.apiCall().then(() => {
      this.setState({refreshing: false});
    });
  }

  pageCall() {
    const config = {
      headers: {
        'X-User-Email': this.props.ApplicationStore.email,
        'X-User-Token': this.props.ApplicationStore.token,
      },
    };
    axios.get(`${ApiServer.RESTAURANTS}/list?page=${this.state.page}&s=${this.state.search_params}`, config)
      .then((response) => {
        console.log(response);
        if (response.data === undefined || response.data.length === 0) {
          this.setState({ no_more: true });
        }
        this.setState({
          restaurants: [ ...this.state.restaurants, ...response.data ],
          page_loading: false,
        });
      }).catch((error) => {
      console.log(error.response);
    });
  }

  nextPage() {
    this.setState({
      page: this.state.page + 1,
      page_loading: true,
    }, () => {
      this.pageCall();
    });
  }

  render() {
    const { container, preLoading } = BaseStyle;
    const { navigation } = this.props;

    return (
      <Container>
        <Content refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }>
          <FlatList
            data={this.state.restaurants}
            style={{
              paddingTop: 10,
            }}
            renderItem={({ item }) => (
              <FiveUnitBar
                multiple
                id={item.id}
                title={item.title}
                location={item.location}
                image_url={item.image_medium_url}
                icon={'ios-arrow-forward-outline'}
                onPress={() => this.props.navigation.navigate(`${item.klass}Show`, {
                  title: item.title,
                  id: item.id,
                  navLoading: true,
                })}
              />
            )}
            keyExtractor={item => 'restaurant-list-' + item.id}
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
