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

const MyItemUnitBar = ({ title, location, image_url, date_time, onPress }) => {
  const { container } = BaseStyle;
  return (
    <ListItem avatar button onPress={onPress} transparent>
      <Left>
        <Thumbnail source={{ uri: image_url }}/>
      </Left>
      <Body style={{ borderBottomWidth: 0 }}>
      <Text>{location} {title}</Text>
      <Text note>Doing what you like will always keep you happy . .</Text>
      </Body>
      <Right style={{ borderBottomWidth: 0 }}>
        <Text note>{date_time}</Text>
      </Right>
    </ListItem>
  );
};

export { MyItemUnitBar };
