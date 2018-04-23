import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import {
  Card,
  CardItem,
  Text,
  Thumbnail,
  ListItem,
  Left,
  Body,
  Right,
  Badge,
  Container,
  Content
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import { FollowSmallButton } from '../../component/common';
import * as Images from '../../assets/images/Images';
import * as Constant from '../../config/Constant';
import BaseStyle from '../../config/BaseStyle';

var cardPadding = 8;
var cardMargin = 8;
var cardInnerMargin = 2;
var pureWidth = Constant.deviceWidth - cardMargin * 2 - cardPadding * 2;

const UnitImage = ({ five, image, width, height }) => {
  if (five) {
    return (
      <Image key={1} source={{ uri: five.image_medium_url }} style={{height: height - 2, width: width - 2, marginRight: 1, marginBottom: 1, borderRadius: 12 }}/>
    )
  } else {
    return (
      <Image key={2} source={image} style={{height: height - 2, width: width - 2, marginRight: 1, marginBottom: 1,  borderRadius: 12 }}/>
    )
  }
};

const FiveImages = ({ fives, image, pureWidth }) => {
  return(
    <Grid>
      <Col size={50}>
        <UnitImage five={fives[0]} image={image} height={(pureWidth / 2)} width={(pureWidth / 2)} />
      </Col>
      <Col size={25}>
        <Row size={1}>
          <UnitImage five={fives[1]} image={image} height={(pureWidth / 4)} width={(pureWidth / 4)} />
        </Row>
        <Row size={1}>
           <UnitImage five={fives[2]} image={image} height={(pureWidth / 4)} width={(pureWidth / 4)} />
        </Row>
      </Col>
      <Col size={25}>
        <Row size={1}>
           <UnitImage five={fives[3]} image={image} height={(pureWidth / 4)} width={(pureWidth / 4)} />
        </Row>
        <Row size={1}>
           <UnitImage five={fives[4]} image={image} height={(pureWidth / 4)} width={(pureWidth / 4)} />
        </Row>
      </Col>
  </Grid>
  )
};

const FivesBar = ({ image, fiveImage, onPress, category, followers, followees, fives, followButton, onPressFollow, clicked, loading }) => {
  const { container } = BaseStyle;

  return (
    <View>
      <View style={{ width: pureWidth + cardPadding * 2, margin: cardMargin, padding: cardPadding, borderRadius: 12, backgroundColor: 'white' }}>
        <TouchableOpacity style={{ backgroundColor: 'transparent' }} onPress={onPress}>
          <FiveImages fives={fives} image={image} pureWidth={pureWidth} />
          <ListItem cardStyle transparent button>
            <Thumbnail size={50} source={fiveImage}/>
            <Body>
              <Text medium style={{ fontFamily: 'montserrat', paddingTop: 3, paddingBottom: 2 }}>{Constant.CategoryToKorean(category)}</Text>
              <View style = {{ flexDirection: 'row' }}>
                <Col>
{/*                  <Text style = {styles.fivesBarFollowNumber}>아이유 스물셋 외 4</Text> */}
                  <Text style = {styles.fivesBarFollowNumber}>{'팔로워'}  {Number(followers).toLocaleString()}      {'팔로잉'}  {Number(followees).toLocaleString()}</Text> 
                </Col>
              </View>
            </Body>
            {followButton ?
              <Right>
                <FollowSmallButton
                onPress={onPressFollow}
                textTrue={'팔로잉'}
                textFalse={'팔로우'}
                clicked={clicked}
                loading={loading}
                />
              </Right> : null}
          </ListItem>
        </TouchableOpacity>
      </View>
      <View style = {{ height: 16, backgroundColor: 'transparent' }}>
        <Text></Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({

  fivesBarFollowText: {
    color: Constant.GreyColor,
    fontFamily: 'montserrat',
    fontSize: 14,
    fontWeight: '100',
  },
  fivesBarFollowNumber: {
    color: Constant.LightGrey,
    fontFamily: 'montserrat',
    fontSize: 14,
    fontWeight: '100',
  },
});

export { FivesBar };
