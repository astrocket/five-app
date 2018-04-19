import React from 'react';
import { View } from 'react-native';
import {
  Card,
  CardItem,
  Text,
  Thumbnail,
  ListItem,
  Left,
  Body,
  Right,
  Badge
} from 'native-base';
import BaseStyle from '../../config/BaseStyle';
import Icon from 'react-native-vector-icons/FontAwesome';

const HomeCategoryBar = ({ image, onPress, title, people, new_people }) => {
  const { container } = BaseStyle;
  return (
    <ListItem button
              onPress={onPress} style={{ paddingLeft: 0 }}>
      <Body>
      <Text medium-thin primary>{title}</Text>
      </Body>
      <Right>
        <Icon name="angle-right"/>
      </Right>
    </ListItem>
  );
};

export { HomeCategoryBar };
