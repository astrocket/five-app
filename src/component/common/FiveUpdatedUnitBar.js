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

const FiveUpdatedUnitBar = ({ id, location, title, image_url, onPress }) => {
  const { container } = BaseStyle;

  return (
    <ListItem avatarUpdatedList button onPress={onPress}>
      <Image
        style={{ width: 90, height: 90, borderRadius: 20 }}
        source={{ uri: image_url }}
      />
      <Body>
      <View style={{ flex: 1 }}>
        <Text normal numberOfLines={1}>{title}</Text>
        <Text note numberOfLines={1}>{location}</Text>
      </View>
      </Body>
      <Right>
        <Text note>2017.12.13</Text>
      </Right>
    </ListItem>
  );
};

export { FiveUpdatedUnitBar };
