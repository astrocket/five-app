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
import { FollowSmallButton } from './FollowSmallButton';
import BaseStyle from '../../config/BaseStyle';

const FollowUnitBar = ({ user, onPress, following }) => {
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
        <FollowSmallButton
          icon={'logo-apple'}
          clicked={following.restaurant}
        />
        <FollowSmallButton
          icon={'logo-apple'}
          clicked={following.music}
        />
        <FollowSmallButton
          icon={'logo-apple'}
          clicked={following.book}
        />
      </Right>
    </ListItem>
  );
};

export { FollowUnitBar };
