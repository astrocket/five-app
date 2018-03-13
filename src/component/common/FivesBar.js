import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import {
  Card,
  CardItem,
  Text,
  Thumbnail,
  ListItem,
  Left,
  Body,
  Right,
  Badge
} from 'native-base';
import * as Images from '../../assets/images/Images';
import * as Constant from '../../config/Constant';
import BaseStyle from '../../config/BaseStyle';

const UnitImage = ({ five, image, width, height }) => {
  if (five) {
    return (
      <Image key={1} source={{ uri: five.image_medium_url }} style={{height: height - 4, width: width - 4, marginRight: 4, marginBottom: 4, borderRadius: 10 }}/>
    )
  } else {
    return (
      <Image key={2} source={image} style={{height: height - 4, width: width - 4, marginRight: 4, marginBottom: 4}}/>
    )
  }
};

const FiveImages = ({ fives, image, pureWidth }) => {
  return(
    <View style={{ flexDirection: 'row', flex: 1, height: pureWidth / 2, width: pureWidth}}>
      <View style={{ flex: 1, marginRight: 4 }}>
        <UnitImage five={fives[0]} image={image} height={pureWidth / 2} width={pureWidth / 2} />
      </View>
      <View style={{ flex: 1, flexWrap: 'wrap' }}>
        <UnitImage five={fives[1]} image={image} height={pureWidth / 4} width={pureWidth / 4} />
        <UnitImage five={fives[2]} image={image} height={pureWidth / 4} width={pureWidth / 4} />
        <UnitImage five={fives[3]} image={image} height={pureWidth / 4} width={pureWidth / 4} />
        <UnitImage five={fives[4]} image={image} height={pureWidth / 4} width={pureWidth / 4} />
      </View>
    </View>
  )
};

const FivesBar = ({ image, onPress, category, followers, followees, fives }) => {
  const { container } = BaseStyle;
  let cardPadding = 5;
  let cardMargin = 20;
  let pureWidth = Constant.deviceWidth - cardMargin * 2 - cardPadding * 2;

  return (
    <View style={{ width: pureWidth + cardPadding * 2, margin: cardMargin, padding: cardPadding}}>
      <TouchableOpacity onPress={onPress}>
        <FiveImages fives={fives} image={image} pureWidth={pureWidth} />
      </TouchableOpacity>
      <ListItem cardStyle transparent button onPress={onPress}>
        <Thumbnail size={50} source={image}/>
        <Body>
          <Text medium>{category}</Text>
          <View style={{ flexDirection: 'row'}}>
            <Text small style={{ marginRight: 0 }}>{Number(followers).toLocaleString()}</Text>
            <Text note>{'Follower'}</Text>
            <Text small style={{ marginRight: 0 }}>{Number(followees).toLocaleString()}</Text>
            <Text note>{'Following'}</Text>
          </View>
        </Body>
      </ListItem>
    </View>
  );
};

export { FivesBar };
