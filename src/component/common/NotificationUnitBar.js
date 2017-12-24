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
  Icon,
} from 'native-base';
import BaseStyle from '../../config/BaseStyle';

const NotificationUnitBar = ({ id, user, title, created_at, onPress }) => {
  const { container } = BaseStyle;
  return (
    <ListItem button onPress={onPress} transparent>
      <Body>
      <Text>{title}</Text>
      </Body>
      <Right>
        <Text note numberOfLines={1}>{created_at.split('T')[0]}</Text>
      </Right>
    </ListItem>
  );
};

export { NotificationUnitBar };
