import React, { Component } from 'react';
import {
  View,
  FlatList,
} from 'react-native';
import {
  Container,
  Header,
  Content,
  Text,
  Spinner,
} from 'native-base';
import {
  Col,
  Row,
  Grid,
} from 'react-native-easy-grid';
import { FoodUnitBar } from '../../component/common';
import FoodShow from './FoodShow';
import axios from 'axios';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import ApplicationStore from '../../mobx/ApplicationStore';
import PopupDialog from 'react-native-popup-dialog';

export default class FoodList extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: '새로 선정된 맛집',
    ... Constant.FiveNavOptions,
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: false, //실서비스에서는 로딩 true로
      foods: this.props.navigation.state.params.foods,
      popup: ''
    };
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

  openPopUp(item) {
    this.setState({
      popup: item,
    }, () => this.popupDialog.show());
  }

  renderPopUp(item) {
    const { navigation } = this.props;
    return (
      <PopupDialog
        width={0.9}
        height={400}
        dialogStyle={{ position: 'relative', top: -40}}
        ref={(popupDialog) => {
          this.popupDialog = popupDialog;
        }}
      >
        <FoodShow
          item={item}
          navigation={navigation}
        />
      </PopupDialog>
    );
  }

  render() {
    const { container, preLoading } = BaseStyle;
    const { navigation } = this.props;

    return (
      <Container>
        <Content>
          <FlatList
            data={this.state.foods}
            renderItem={({ item }) => (
              <FoodUnitBar
                id={item.id}
                title={item.title}
                location={item.location}
                image_url={item.image_url}
                onPress={() => this.openPopUp(item)}
              />
            )}
            keyExtractor={item => 'food-list-' + item.id}
          />
        </Content>
        {this.renderPopUp(this.state.popup)}
        {this.state.loading &&
        <View style={preLoading}>
          <Spinner size="large" />
        </View>
        }
      </Container>
    );
  }
}
