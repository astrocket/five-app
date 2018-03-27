import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import {
  Card, CardItem, Text, Thumbnail, ListItem, Left, Body, Right, Badge
} from 'native-base';
import { FollowSmallButton } from '../../component/common';
import * as Images from '../../assets/images/Images';
import * as Constant from '../../config/Constant';
import BaseStyle from '../../config/BaseStyle';

const UnitImage = ({ five, defaultImage, width, height }) => {
  if (five) {
    return (
      <Image key={1} source={{ uri: five.image_medium_url }} style={{height: height - 4, width: width - 4, margin: 2, borderRadius: 10 }}/>
    )
  } else {
    return (
      <Image key={2} source={defaultImage} style={{height: height - 4, width: width - 4, margin: 2}}/>
    )
  }
};

const FiveImages = ({ fives, defaultImage, pureWidth }) => {
  return(
    <View style={{ flexDirection: 'row', flex: 1, height: pureWidth / 2, width: pureWidth}}>
      <View style={{ flex: 1 }}>
        <UnitImage five={fives[0]} defaultImage={defaultImage} height={pureWidth / 2} width={pureWidth / 2} />
      </View>
      <View style={{ flex: 1, flexWrap: 'wrap' }}>
        <UnitImage five={fives[1]} defaultImage={defaultImage} height={pureWidth / 4} width={pureWidth / 4} />
        <UnitImage five={fives[2]} defaultImage={defaultImage} height={pureWidth / 4} width={pureWidth / 4} />
        <UnitImage five={fives[3]} defaultImage={defaultImage} height={pureWidth / 4} width={pureWidth / 4} />
        <UnitImage five={fives[4]} defaultImage={defaultImage} height={pureWidth / 4} width={pureWidth / 4} />
      </View>
    </View>
  )
};


const UserFivesBar = ({ defaultImage, onPress, onPressFollow, category, fives, user, clicked }) => {
  const { container } = BaseStyle;
  let cardPadding = 5;
  let cardMargin = 20;
  let pureWidth = Constant.deviceWidth - 30 - cardMargin * 2 - cardPadding * 2;

  return (
    <View style={{ backgroundColor: '#FFF', marginRight: 10, borderRadius: 10}}>
      <TouchableOpacity onPress={onPress}>
        <View style={{ flexDirection: 'row', height: null,
          width: Constant.deviceWidth - 60,
          marginBottom: 10,
          padding: 10,
          flex: 1, }}>
          <FiveImages fives={fives} defaultImage={defaultImage} pureWidth={pureWidth} />
        </View>
      </TouchableOpacity>
      <ListItem cardStyle style={{ borderRadius: 10, backgroundColor: 'transparent' }}>
        <Thumbnail small source={{ uri: user.image_url}}/>
        <Body>
        <View style={{ flexDirection: 'column'}}>
          <Text note>{user.name}의</Text>
          <Text medium>{Constant.CategoryToKorean(category)}</Text>
        </View>
        </Body>
        <Right>
          <FollowSmallButton
            onPress={onPressFollow}
            textTrue={'팔로잉'}
            textFalse={'팔로우'}
            clicked={clicked}
          />
        </Right>
      </ListItem>
    </View>
  );
};

export { UserFivesBar };
