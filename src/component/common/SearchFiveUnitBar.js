import React from 'react';
import {
  Image, TouchableOpacity, View,
} from 'react-native';
import {
  FollowSmallButton
} from './FollowSmallButton';
import * as Images from '../../assets/images/Images';
import {
  Card, CardItem, Text, Thumbnail, ListItem,  Left,  Body,  Right, Icon
} from 'native-base';
import BaseStyle from '../../config/BaseStyle';

const FiveUnitBarImage = ({ image_url }) => {
  if (image_url) {
    return (
      <Image
        style={{ width: 60, height: 60, borderRadius: 20 }}
        source={{ uri: image_url }}
      />
    )
  } else {
    return (
      <Image
        style={{ width: 60, height: 60, borderRadius: 20 }}
        source={Images.restaurant_main}
      />
    )
  }
};

const SearchFiveUnitBar = ({ id, subtitle, title, onPress, onPressImage, clicked, image_url  }) => {
  const { container } = BaseStyle;

  if (clicked) {
    return (
      <ListItem avatarList>
        <TouchableOpacity onPress={onPressImage}>
          <FiveUnitBarImage image_url={image_url} />
        </TouchableOpacity>
        <Body>
        <View style={{ flex: 1, height: 50, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between'}}>
          <Text normal numberOfLines={1}>{title}</Text>
          <Text note numberOfLines={1}>{subtitle}</Text>
        </View>
        </Body>
        <Right style={{ alignItems: 'center', alignSelf: 'center' }}>
          <View style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingRight: 5,
          }}>
            <FollowSmallButton
              textTrue={'담김'}
              textFalse={'+ 담기'}
              clicked={clicked}
            />
          </View>
        </Right>
      </ListItem>
    );
  } else {
    return (
      <ListItem avatarList>
        <TouchableOpacity onPress={onPressImage}>
          <FiveUnitBarImage image_url={image_url} />
        </TouchableOpacity>
        <Body>
        <View style={{ flex: 1, height: 50, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between'}}>
          <Text normal numberOfLines={1}>{title}</Text>
          <Text note numberOfLines={1}>{subtitle}</Text>
        </View>
        </Body>
        <Right style={{ alignItems: 'center', alignSelf: 'center' }}>
          <View style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingRight: 5,
          }}>
            <FollowSmallButton
              onPress={onPress}
              textTrue={'담김'}
              textFalse={'+ 담기'}
              clicked={clicked}
            />
          </View>
        </Right>
      </ListItem>
    );
  }
};

export { SearchFiveUnitBar };
