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

const NoticeUnitBar = ({ id, title, content, created_at, onPress }) => {
  const { container } = BaseStyle;
  return (
    <ListItem button onPress={onPress} transparent>
      <Body>
      <Text>{title}</Text>
      </Body>
      <Right>
        <Icon name="arrow-forward"/>
      </Right>
    </ListItem>
  );
};

export { NoticeUnitBar };
