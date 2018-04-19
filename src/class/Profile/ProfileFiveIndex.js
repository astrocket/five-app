import React, { Component } from 'react';
import {
  View, Image, TouchableOpacity, FlatList, RefreshControl, ScrollView, StyleSheet
} from 'react-native';
import {
  Container, Header, Content, Text, Spinner,
  Card, CardItem, Thumbnail, Button, Icon, Left,
  Body, Right, H1, Toast, ListItem, ActionSheet, Fab, DeckSwiper,
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import {
  FiveUnitBar, FiveUnitFullCenter, NavBar,
} from '../../component/common';
import { FollowSmallButton } from '../../component/common';
import axios from 'axios';
import { NavigationActions } from 'react-navigation';
import * as Images from '../../assets/images/Images';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('ApplicationStore') // Inject some or all the stores!
@observer
export default class ProfileFiveIndex extends Component {

  static navigationOptions = ({ navigation }) => ({
/*    headerRight: (
      navigation.state.params.navLoading ?
        null :
        <View style={BaseStyle.headerDoubleIconsContainer}>
          <Button onPress={navigation.state.params.openShareActionSheet} transparent>
            <Icon
              name="ios-share-outline"
              style={{
                fontSize: 25,
                color: Constant.FiveColor,
              }}
            />
          </Button>
        </View>
    ),*/
   header: null
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: true, //실서비스에서는 로딩 true로
      refreshing: false,
      header: {
        headers: {
          'X-User-Email': this.props.ApplicationStore.email,
          'X-User-Token': this.props.ApplicationStore.token,
        },
      },
      category: this.props.navigation.state.params.category,
      flip: false,
      clicked: false,
      fives: [],
      followers_count: '',
      followees_count: '',
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({
      openShareActionSheet: () => this.openShareActionSheet(),
      toggleFollow: () => this.toggleFollow(),
    });
    this.apiCall();
  }

  async apiCall() {
    await axios.get(`${ApiServer.MY_PROFILE}/fives?category=${this.state.category}`, this.state.header)
      .then((response) => {
        this.setState({
          loading: false,
          klass: response.data.klass,
          category_korean: response.data.category_korean,
          fives: response.data.fives,
          followers_count: response.data.followers_count,
          followees_count: response.data.followees_count,
        });
      })
      .catch((error) => {
        console.log('에러 : ' + error.response);
      });
  }

  _onRefresh() {
    this.setState({refreshing: true});
    this.apiCall().then(() => {
      this.setState({refreshing: false});
    });
  }

  openShareActionSheet() {
    const BUTTONS = [ '카카오톡 공유하기', 'Cancel' ];
    const CANCEL_INDEX = 1;

    ActionSheet.show(
      {
        options: BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
      },
      buttonIndex => this.shareAction(BUTTONS[buttonIndex]),
    );
  }

  shareAction(value) {
    Toast.show({
      text: value,
      position: 'bottom',
      duration: 1500
    })
  }

  flipCard() {
    this.setState({
      flip: !this.state.flip,
    });
  }

  renderFlipButton(flip) {
    if (flip) {
      return (
        <Button onPress={() => this.flipCard()} transparent>
          <Icon
            name="md-photos"
            style={{
              fontSize: 25,
              color: '#000',
            }}
          />
        </Button>
      );
    } else {
      return (
        <Button onPress={() => this.flipCard()} transparent>
          <Icon
            name="md-reorder"
            style={{
              fontSize: 25,
              color: '#000',
            }}
          />
        </Button>
      );
    }
  }

  renderCard(flip) {
    const { rowWrapper } = BaseStyle;
    const { navigation } = this.props;

    if (flip) {
      return (
        <Row key={1}>
          <FlatList
            data={this.state.fives}
            renderItem={({ item }) => (
              <FiveUnitBar
                id={item.id}
                title={item.title}
                subtitle={item.subtitle}
                friends_info={`FIVE ${item.five_users_count}`}
                image_url={item.image_medium_url}
                onPress={() => navigation.navigate('FiveShow', {
                  category: this.state.category,
                  title: item.title,
                  id: item.id,
                  navLoading: true,
                })}
                new_label={item.new_label}
              />
            )}
            keyExtractor={item => 'five-bar-list-' + item.id}
          />
        </Row>
      );
    } else {
      return (
        <Row key={2}>
          <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={10}
              pagingEnabled={true}
            >
              {this.state.fives.map((item) => {
                return (
                  <FiveUnitFullCenter
                    multiple
                    key={item.id}
                    id={item.id}
                    subtitle={item.subtitle}
                    title={item.title}
                    friends_info={`FIVE ${item.five_users_count}`}
                    image_url={item.image_large_url}
                    onPress={() => navigation.navigate('FiveShow', {
                      category: this.state.category,
                      title: item.title,
                      id: item.id,
                      navLoading: true,
                    })}
                    borderRadius={12}
                    cardCut={80}
                  />
                )
              })}
              {        
                <Grid style={{
                    backgroundColor: '#fafafa',
                    height: 400,
                    width: Constant.deviceWidth,
                    justifyContent: 'center',
                    marginBottom: 0,
                  }}>
                  <Col style = {{ width: 16, backgroundColor: 'white', borderTopRightRadius: 12, borderBottomRightRadius: 12 }}>
                  </Col>
                  <Col style = {{ width: 8, backgroundColor: '#fafafa' }}>
                  </Col>
                  <Col style = {{ backgroundColor: '#fafafa', borderRadius: 12 }}>
                    <Row style = {{ height: 8 }}></Row>
                    <FlatList
                      style = {{ backgroundColor: "#fafafa" }}
                      data={this.state.fives}
                      renderItem={({ item }) => (
                        <FiveUnitBar
                          id={item.id}
                          title={item.title}
                          subtitle={item.subtitle}
                          friends_info={`FIVE ${item.five_users_count}`}
                          image_url={item.image_medium_url}
                          onPress={() => navigation.navigate('FiveShow', {
                            category: this.state.category,
                            title: item.title,
                            id: item.id,
                            navLoading: true,
                          })}
                          new_label={item.new_label}
                        />
                      )}
                      keyExtractor={item => 'five-bar-list-' + item.id}
                    /> 
                  </Col>       
                  <Col style = {{ width: 16, backgroundColor: '#fafafa' }}>
                  </Col>          
                  <Col style = {{ width: 24, backgroundColor: 'white', borderTopLeftRadius: 12, borderBottomLeftRadius: 12 }}>
                  </Col>
                </Grid>
              }
            </ScrollView>
        </Row>
      );
    }
  }

  render() {
    const { container, preLoading, rowFlexCenterCenter } = BaseStyle;
    const { navigation } = this.props;
    const { my_profile } = this.props.ApplicationStore;

    return (
      <Container>
        <NavBar
          leftButton
          leftAsImage
          leftIcon={require('../../assets/images/back_icon_pink.png')}
          onPressLeft={() => navigation.goBack()}
          rightButton
          rightAsImage
          rightIcon={require('../../assets/images/pencil_icon_pink.png')}
          onPressRight={() => navigation.navigate('ProfileFiveEdit', {
            category: this.state.category,
            category_korean: this.state.category_korean,
            klass: this.state.klass,
          })}
          headerText=""
        />
        <Content refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }>
          <Grid>
            <View style={{ marginBottom: 10 }}>
              <View style={rowFlexCenterCenter}>
                <Text style = {styles.fiveUsername}>{my_profile.name}의</Text>
              </View>
              <View style={rowFlexCenterCenter}>
                <Text style = {styles.fiveTitle}>{this.state.category_korean} 파이브</Text>
              </View>
              <View style={rowFlexCenterCenter}>
                <TouchableOpacity transparent style={{
                  flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', margin: 10
                }} onPress={() => navigation.navigate('ProfileFollowerIndex', { category: this.state.category })}>
                  <Text style = {styles.fiveFollowText}>{'팔로워  '}</Text>
                  <Text style = {styles.fiveFollowNumber}>{Number(this.state.followers_count).toLocaleString()}</Text> 
                </TouchableOpacity>
                <TouchableOpacity transparent style={{
                  flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: 10
                }} onPress={() => navigation.navigate('ProfileFolloweeIndex', { category: this.state.category })}>
                  <Text style = {styles.fiveFollowText}>{'팔로잉  '}</Text>
                  <Text style = {styles.fiveFollowNumber}>{Number(this.state.followees_count).toLocaleString()}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Row style = {{ height: 16, backgroundColor: '#fafafa' }}></Row>
            {this.renderCard(this.state.flip)}
            <Row style = {{ height: 48, backgroundColor: '#fafafa' }}></Row>
          </Grid>
        </Content>
{/*        <Fab
          active={true}
          direction="up"
          style={{ backgroundColor: Constant.FiveColor }}
          position="bottomRight"
          onPress={() => this.flipCard()}>
          <Icon
            name="md-reorder"
            style={{
              fontSize: 25,
              color: '#FFF',
            }}
          />
        </Fab> */}
        {this.state.loading &&
        <View style={preLoading}>
          <Spinner size="large"/>
        </View>
        }
      </Container>
    );
  }
}


const styles = StyleSheet.create({
  fiveUsername: {
    color: Constant.GreyColor,
    fontFamily: 'montserrat',
    fontSize: 18,
    fontWeight: '600',
  },
  fiveTitle: {
    color: '#333333',
    fontFamily: 'montserrat',
    fontSize: 28,
    fontWeight: '900',
  },
  fiveFollowText: {
    color: 'grey',
    fontSize: 16,
    fontWeight: '100',
  },
  fiveFollowNumber: {
    color: '#333333',
    fontFamily: 'montserrat',
    fontSize: 16,
    fontWeight: '200',
  },
});
