import React from 'react';
import {
  Image,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Text,
  Thumbnail,
  ListItem,
  Left,
  Body,
  Right,
} from 'native-base';
import BaseStyle from '../../config/BaseStyle';

const UserUnitBar = ({ id, name, image_url, onPress }) => {
  const { container } = BaseStyle;
  return (
    <ListItem avatar button onPress={onPress} transparent>
      <Left>
        <Thumbnail source={{ uri: image_url }}/>
      </Left>
      <Body style={{ borderBottomWidth: 0 }}>
      <Text>{name}</Text>
      <Text note>Doing what you like will always keep you happy . .</Text>
      </Body>
      <Right style={{ borderBottomWidth: 0 }}>
        <Text note>2017.12.13</Text>
      </Right>
    </ListItem>
  );
};

export { UserUnitBar };
