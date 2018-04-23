import React, { Component } from 'react';
import {
  View, FlatList, RefreshControl, TouchableOpacity, Alert, StyleSheet, ScrollView
} from 'react-native';
import {
  Container, Header, Content, Text, Spinner,
  Card, CardItem, Thumbnail, Button, Icon, Left,
  Body, Right, H1, Toast, ListItem, ActionSheet, Fab,
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import {
  FiveUnitBar, FiveUnitFull, FiveUnitFullCenter
} from '../../component/common';
import { FollowSmallButton, ImageCon } from '../../component/common';
import * as Images from '../../assets/images/Images';
import * as Constant from '../../config/Constant';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('stores') @observer
export default class UserFiveShow extends Component {

  static navigationOptions = ({ navigation }) => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.app = this.props.stores.app;
    this.server = this.props.stores.server;
    this.five = this.props.stores.five;
    this.state = {
      loading: true,
      refreshing: false,
      category: this.props.navigation.state.params.category,
      klass: '',
      user: this.props.navigation.state.params.user,
      flip: false,
      clicked: false,
      fives: [],
      followers_count: '',
      followees_count: '',
      following: false,
    };
  }

  componentDidMount() {
    this.server.userFives(this.state.user.id, this.state.category, (res) => {
      this.setState({
        klass: res.data.klass, category_korean: res.data.category_korean,
        fives: res.data.fives, followers_count: res.data.followers_count,
        followees_count: res.data.followees_count, following: res.data.following,
      });
    }).then(() => this.setState({ loading: false }))
  }

  _onRefresh() {
    this.setState({ refreshing: true }, () => {
      this.server.userFives(this.state.user.id, this.state.category, (res) => {
        this.setState({
          klass: res.data.klass, category_korean: res.data.category_korean,
          fives: res.data.fives, followers_count: res.data.followers_count,
          followees_count: res.data.followees_count, following: res.data.following,
        });
      }).then(() => this.setState({ refreshing: false }))
    });
  }

  toggleFollow() {
    const have = this.app.hasCategory(this.state.category);
    if (have) {
      this.followCall();
    } else {
      Alert.alert(
        `아직 참여한 카테고리는 아니에요`,
        `${Constant.askToParticipate(this.state.category_korean, this.state.user.name)}`,
        [ {
            text: '네',
            onPress: () => this.followCall(five)
              .then(() => this.props.navigation.navigate(`SearchFive`, { category: this.state.category, category_korean: this.state.category_korean, klass: this.state.klass}))
        },
          { text: '취소', style: 'cancel'},
        ], { cancelable: true },
      );
    }
  }

  async followCall() {
    await this.server.followPost(this.state.user.id, this.state.following, this.state.category, (res) => this.onFollowSuccess(res))
  }

  async onFollowSuccess(response) {
    const new_following = response.data;
    await this.setState({
      following: new_following,
      followers_count: new_following ? this.state.followers_count += 1 : this.state.followers_count -= 1,
    });
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
    const { navigation } = this.props;
    const { rowWrapper } = BaseStyle;

    if (flip) {
      return (
        <Row key={1}>
          <FlatList
            data={this.state.fives}
            renderItem={({ item }) => (
              <FiveUnitBar
                multiple
                id={item.id}
                title={item.title}
                subtitle={item.subtitle}
                friends_info={`FIVE ${item.five_users_count}`}
                image_url={item.image_medium_url}
                icon={'ios-arrow-forward-outline'}
                onPress={() => navigation.navigate('FiveShow', {
                  category: item.category,
                  title: item.title,
                  id: item.id,
                })}
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
                key={item.id}
                multiple
                id={item.id}
                subtitle={item.subtitle}
                title={item.title}
                friends_info={`FIVE ${item.five_users_count}`}
                image_url={item.image_large_url}
                onPress={() => navigation.navigate('FiveShow', {
                  category: item.category,
                  title: item.title,
                  id: item.id,
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
                  <Col style = {{ width: 24, backgroundColor: 'white', borderTopRightRadius: 12, borderBottomRightRadius: 12 }}>
                  </Col>
                  <Col style = {{ width: 4, backgroundColor: '#fafafa' }}>
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

    return (
      <Container>
        <Header
          rounded
          style={{
            backgroundColor: '#FFF',
            borderBottomWidth: 0,
            elevation: 0,
          }}>
          <Left>
            <Button transparent onPress={() => navigation.goBack()}>
              <ImageCon
                image={require('../../assets/images/back_icon_pink.png')}
              />
            </Button>
          </Left>
          <Body>

          </Body>
          <Right>
            <FollowSmallButton
              onPress={() => this.toggleFollow()}
              textTrue={'팔로잉'}
              textFalse={'팔로우'}
              clicked={this.state.following}
            />
          </Right>
        </Header>
        <Content refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }>
          <Grid>
            <View style={rowFlexCenterCenter}>
              <Text style = {styles.fiveUsername}>{this.state.user.name}의</Text>
            </View>
            <View style={rowFlexCenterCenter}>
              <Text style = {styles.fiveTitle}>{this.state.category_korean}</Text><Text style = {styles.fiveTitleFive}> 파이브</Text>
            </View>
            <View style={rowFlexCenterCenter}>
              <TouchableOpacity transparent style={{
                flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', margin: 10
              }} onPress={() => navigation.navigate('UserFollowerIndex', { category: this.state.category, user: navigation.state.params.user})}>
                <Text style = {styles.fiveFollowText}>팔로워  </Text>
                <Text style = {styles.fiveFollowNumber}>{Number(this.state.followers_count).toLocaleString()}</Text>
              </TouchableOpacity>
              <TouchableOpacity transparent style={{
                flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: 10
              }} onPress={() => navigation.navigate('UserFolloweeIndex', { category: this.state.category, user: navigation.state.params.user})}>
                <Text style = {styles.fiveFollowText}>팔로잉  </Text>
                <Text style = {styles.fiveFollowNumber}>{Number(this.state.followees_count).toLocaleString()}</Text>
              </TouchableOpacity>
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
    fontSize: 18,
    fontWeight: '400',
  },
  fiveTitle: {
    color: '#333333',
    fontFamily: 'montserrat',
    fontSize: 28,
    fontWeight: '800',
  },
    fiveTitleFive: {
    color: '#333333',
    fontSize: 28,
    fontWeight: '300',
  },
  fiveFollowText: {
    color: Constant.GreyColor,
    fontSize: 16,
    fontWeight: '100',
  },
  fiveFollowNumber: {
    color: '#333333',
    fontFamily: 'montserrat',
    fontSize: 16,
    fontWeight: '300',
  },
});

