import React, { Component } from 'react';
import {
  View, TouchableOpacity, FlatList, RefreshControl, ScrollView, StyleSheet
} from 'react-native';
import {
  Container, Header, Content, Text, Spinner,
  Card, CardItem, Thumbnail, Button, Icon, Left,
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import {
  FiveUnitBar, FiveUnitFullCenter, NavBar,
} from '../../component/common';
import * as Images from '../../assets/images/Images';
import * as Constant from '../../config/Constant';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject, Observer } from 'mobx-react/native';

@inject('stores') @observer
export default class ProfileFiveIndex extends Component {

  static navigationOptions = ({ navigation }) => ({
   header: null
  });

  constructor(props) {
    super(props);
    this.app = this.props.stores.app;
    this.server = this.props.stores.server;
    this.five = this.props.stores.five;
    this.state = {
      loading: false,
      refreshing: false,
      category: this.props.navigation.state.params.category_chunk.category,
      category_korean: this.props.navigation.state.params.category_chunk.category_korean,
      klass: this.props.navigation.state.params.category_chunk.klass,
      flip: false,
      clicked: false,
      fives: this.props.navigation.state.params.category_chunk.fives,
      followers_count: this.props.navigation.state.params.category_chunk.followers_count,
      followees_count: this.props.navigation.state.params.category_chunk.followees_count,
    };
  }

  _onRefresh() {
    this.setState({ refreshing: true }, () => {
      this.server.profileCategoryFive(this.state.category, async (res) => {
        await this.app.updateCategory(this.state.category, res.data)
      }).then(() => this.setState({ refreshing: false }));
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

  renderCard() {
    const navigation = this.props.navigation;
    return (
      <FlatList
        key={'flat-list-card-section'}
        data={this.app.findCategory(this.state.category).get().fives}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={10}
        pagingEnabled={true}
        renderItem={({ item }) => (
          <FiveUnitFullCenter
            multiple
            id={item.id}
            subtitle={item.subtitle}
            title={item.title}
            friends_info={`FIVE ${item.five_users_count}`}
            image_url={item.image_large_url}
            onPress={() => navigation.navigate('FiveShow', {
              category: this.state.category,
              title: item.title,
              id: item.id,
            })}
            borderRadius={12}
            cardCut={80}
          />
        )}
        keyExtractor={item => 'card-list' + item.id}
        ListFooterComponent={
          this.renderList()
        }
      />
    )
  }

  renderList() {
    const navigation = this.props.navigation;
    return (
      <View style={{
        backgroundColor: '#fafafa',
        height: 400,
        width: Constant.deviceWidth,
        justifyContent: 'center',
        marginBottom: 0,
      }} key={'inner-grid'}>
        <Col style = {{ width: 16, backgroundColor: 'white', borderTopRightRadius: 12, borderBottomRightRadius: 12 }}>
        </Col>
        <Col style = {{ width: 8, backgroundColor: '#fafafa' }}>
        </Col>
        <Col style = {{ backgroundColor: '#fafafa', borderRadius: 12 }}>
          <Row style = {{ height: 8 }}></Row>
          <FlatList
            key={'flat-list-listing-section'}
            data={this.app.findCategory(this.state.category).get().fives}
            style = {{ backgroundColor: "#fafafa" }}
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
      </View>
    )
  }

  render() {
    const { container, preLoading, rowFlexCenterCenter } = BaseStyle;
    const { navigation } = this.props;
    const { my_profile } = this.app;

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
            navigation: this.props.navigation
          })}
          headerText=""
        />
        <Content refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }>
          <Grid key={'outer-grid'}>
            <View style={{ marginBottom: 10 }}>
              <View style={rowFlexCenterCenter}>
                <Text style = {styles.fiveUsername}>{my_profile.name}의</Text>
              </View>
              <View style={rowFlexCenterCenter}>
                <Text style = {styles.fiveTitle}>{this.state.category_korean}</Text><Text style = {styles.fiveTitleFive}> 파이브</Text>
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
            <Row key={'card-list'}>
              {this.renderCard()}
            </Row>
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
    color: 'grey',
    fontSize: 18,
    fontWeight: '300',
  },
  fiveTitle: {
    color: '#333333',
    fontSize: 28,
    fontWeight: '800',
  },
    fiveTitleFive: {
    color: '#333333',
    fontSize: 28,
    fontWeight: '300',
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
