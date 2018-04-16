import React from 'react';
import {
  Image, View,
} from 'react-native';
import {
  Card, CardItem, Text, Thumbnail, ListItem, Left, Body, Right, Badge,
} from 'native-base';
import * as Images from '../../assets/images/Images';
import BaseStyle from '../../config/BaseStyle';

const ImagePerRole = ({ user }) => {
  return user.roles.map(function (role) {
    return (
      <Image key={`${user.id}-${role}`} style={{ width: 25, height: 25, borderRadius: 12.5 }} source={Images.findImageOf(role)}/>
    )
  });
};

const SearchUserUnitBar = ({ user, onPress }) => {
  const { container } = BaseStyle;
  if (user.roles.length > 0) {
    return (
      <ListItem avatar button onPress={onPress}>
        <Left>
          <Thumbnail small source={{ uri: user.image_thumb_url }}/>
        </Left>
        <Body style={{ borderBottomWidth: 0 }}>
        <Text numberOfLines={1}>{user.name}</Text>
        <Text note numberOfLines={1}>{user.introduce}</Text>
        </Body>
        <Right style={{
          borderBottomWidth: 0,
          width: 80,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <ImagePerRole user={user}/>
        </Right>
      </ListItem>
    );
  } else {
    return (
      <ListItem avatar button onPress={onPress}>
        <Left>
          <Thumbnail small source={{ uri: user.image_thumb_url }}/>
        </Left>
        <Body style={{ borderBottomWidth: 0 }}>
        <Text numberOfLines={1}>{user.name}</Text>
        <Text note numberOfLines={1}>{user.introduce}</Text>
        </Body>
      </ListItem>
    );
  }
};

export { SearchUserUnitBar };
