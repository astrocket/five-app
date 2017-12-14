import React, { Component } from 'react';
import {
  View, FlatList,
} from 'react-native';
import {
  Container, Header, Content, Text, Spinner,
  Item, Input, Icon, Button,
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import { MyItemUnitBar } from '../../component/common';
import FoodShow from '../Food/FoodShow';
import axios from 'axios';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import ApplicationStore from '../../mobx/ApplicationStore';
import PopupDialog from 'react-native-popup-dialog';

export default class MyItemIndex extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: '내 팔로워',
    ...Constant.FiveNavOptions,
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: false, //실서비스에서는 로딩 true로
      my_items: [
        {
          id: '1',
          date_time: '오늘',
          location: '망리단길',
          title: '이지첸',
          image_url: 'https://scontent.cdninstagram.com/t51.2885-15/s320x320/sh0.08/e35/21980744_278103439350120_3623176725199847424_n.jpg',
        }, {
          id: '2',
          date_time: '2017.12.13',
          location: '의정부',
          title: '부대찌개',
          image_url: 'https://img.buzzfeed.com/buzzfeed-static/static/2017-03/29/15/campaign_images/buzzfeed-prod-fastlane-03/26-delicious-korean-foods-you-need-in-your-life-2-30138-1490814365-13_dblbig.jpg',
        }, {
          id: '3',
          date_time: '2017.12.12',
          location: '강남역',
          title: '도스 타코스',
          image_url: 'https://i.ytimg.com/vi/mEBFswpYms4/maxresdefault.jpg',
        }, {
          id: '4',
          date_time: '2017.12.03',
          location: '성수동',
          title: '도치 피자',
          image_url: 'https://scontent.cdninstagram.com/t51.2885-15/s320x320/e35/23498854_193592511207603_4852021826986967040_n.jpg',
        }, {
          id: '5',
          date_time: '2017.11.29',
          location: '성수동',
          title: '치킨앤 파티',
          image_url: 'https://www.chick-fil-a.com/-/media/Images/CFACOM/Menu-Items/WS-Menu-PDP-Images/Entrees/CFA_PDP_ChickNStrips-3ct_1085.ashx',
        }, {
          id: '6',
          date_time: '2017.11.21',
          location: '부산역',
          title: '중문횟집',
          image_url: 'https://halfoff.adspayusa.com/wp-content/uploads/2017/04/sushi_and_sashimi_for_two.0.jpg',
        },
      ],
      popup: '',
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
        <Header searchBar noShadow rounded style={{
          paddingTop: 0,
          height: 56,
        }}>
          <Item>
            <Icon name="ios-search"/>
            <Input
              placeholder="Search"
              autoCapitalize={'none'}
              autoCorrect={false}
            />
            <Icon name="ios-people"/>
          </Item>
          <Button transparent>
            <Text>검색</Text>
          </Button>
        </Header>
        <Content>
          <FlatList
            data={this.state.my_items}
            renderItem={({ item }) => (
              <MyItemUnitBar
                id={item.id}
                title={item.title}
                onPress={() => this.openPopUp(item)}
                location={item.location}
                image_url={item.image_url}
                date_time={item.date_time}
              />
            )}
            keyExtractor={item => 'my-item-list-' + item.id}
          />
        </Content>
        {this.renderPopUp(this.state.popup)}
        {this.state.loading &&
        <View style={preLoading}>
          <Spinner size="large"/>
        </View>
        }
      </Container>
    );
  }
}
