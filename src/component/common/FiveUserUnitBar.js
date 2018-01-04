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

const FiveUserUnitBar = ({ user, onPress }) => {
  const { container } = BaseStyle;
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
        width: 120,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Text>{user.five_days}</Text>
      </Right>
    </ListItem>
  );
};

export { FiveUserUnitBar };
