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

const FoodUnitBar = ({ id, location, title, image_url, onPress, barWidth, barHeight, borderRadius }) => {
  const { container } = BaseStyle;
  return (
    <ListItem avatar button onPress={onPress}>
      <Left>
        <Thumbnail source={{ uri: image_url }}/>
      </Left>
      <Body>
      <Text>{location} {title}</Text>
      <Text note>Doing what you like will always keep you happy . .</Text>
      </Body>
      <Right>
        <Text note>오늘</Text>
      </Right>
    </ListItem>
  );
};

export { FoodUnitBar };
