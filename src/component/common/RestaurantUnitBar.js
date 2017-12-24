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

const RestaurantUnitBar = ({ id, location, title, image_url, onPress, barWidth, barHeight, borderRadius }) => {
  const { container } = BaseStyle;
  return (
    <ListItem avatar button onPress={onPress}>
      <Left>
        <Thumbnail source={{ uri: image_url }}/>
      </Left>
      <Body style={{ borderBottomWidth: 0 }}>
      <Text>{location} {title}</Text>
      <Text note>Doing what you like will always keep you happy . .</Text>
      </Body>
      <Right style={{ borderBottomWidth: 0 }}>
        <Text note>2017.12.13</Text>
      </Right>
    </ListItem>
  );
};

export { RestaurantUnitBar };
