import React, { Component } from 'react';
import {
  View, Platform,
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
import { NavBar } from '../../component/common';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import axios from 'axios';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('ApplicationStore') // Inject some or all the stores!
@observer
export default class Map extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false, //실서비스에서는 로딩 true로
      title: this.props.screenProps.modalNavigation.state.params.title,
      lat: this.props.screenProps.modalNavigation.state.params.lat,
      lng: this.props.screenProps.modalNavigation.state.params.lng,
    };
  }

  renderMapPerOS() {
    const { navigation } = this.props;

    if (Platform.OS === 'ios') {
      return (
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: parseFloat(this.state.lat),
            longitude: parseFloat(this.state.lng),
            latitudeDelta: 0.0043,
            longitudeDelta: 0.0034
          }}
        >
          <Marker
            coordinate={{
              latitude: parseFloat(this.state.lat),
              longitude: parseFloat(this.state.lng),
            }}
            title={this.state.title}
          />
        </MapView>
      );
    } else {
      return (
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: parseFloat(this.state.lat),
            longitude: parseFloat(this.state.lng),
            latitudeDelta: 0.0043,
            longitudeDelta: 0.0034
          }}
        >
          <Marker
            coordinate={{
              latitude: parseFloat(this.state.lat),
              longitude: parseFloat(this.state.lng),
            }}
            title={this.state.title}
          />
        </MapView>
      );
    }
  }

  render() {
    const { container, preLoading } = BaseStyle;
    const { navigation } = this.props;
    const { modalNavigation } = this.props.screenProps;

    return (
      <Container>
        <NavBar
          rightButton
          rightIcon="ios-close-outline"
          onPressRight={() => modalNavigation.goBack()}
          headerText={this.state.title}
        />
        {this.renderMapPerOS()}
        {this.state.loading &&
        <View style={preLoading}>
          <Spinner size="large"/>
        </View>
        }
      </Container>
    )
  }
}


