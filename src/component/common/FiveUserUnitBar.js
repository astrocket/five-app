import React from 'react';
import {
  Image,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Card,
  CardItem,
  Text,
  Thumbnail,
  ListItem,
  Left,
  Body,
  Right,
} from 'native-base';
import BaseStyle from '../../config/BaseStyle';

const FiveUserUnitBar = ({ user, onPress, style }) => {
  const { container } = BaseStyle;
  return (
    <ListItem avatar button onPress={onPress} style={style}>
      <Left>
        <Thumbnail small source={{ uri: user.image_thumb_url }}/>
      </Left>
      <Body style={{ borderBottomWidth: 0 }}>
      <Text numberOfLines={1}>{user.name}</Text>
      <Text note numberOfLines={1}>{user.introduce}</Text>
      </Body>
    </ListItem>
  );
};

export { FiveUserUnitBar };
