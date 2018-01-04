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

const HomeCategoryBar = ({ image, onPress, title, people, new_people }) => {
  const { container } = BaseStyle;
  return (
    <ListItem cardStyle transparent button onPress={onPress}>
      <Thumbnail square large size={150} source={image}/>
      <Body>
      <Text large>{title}</Text>
      <Text note>{`${Number(people).toLocaleString()}명이 참여하고 있습니다.`}</Text>
      </Body>
      <View style={BaseStyle.topLeftLabel}>
        <Badge primary micro>
          <Text>{new_people} NEW</Text>
        </Badge>
      </View>
    </ListItem>
  );
};

export { HomeCategoryBar };
