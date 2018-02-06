import React from 'react';
import {
  Image, View,
} from 'react-native';
import {
  Card, CardItem, Text, Thumbnail, ListItem, Left, Body, Right, Badge,
} from 'native-base';
import * as Images from '../../assets/images/Images';
import BaseStyle from '../../config/BaseStyle';

const FollowUnitBar = ({ user, onPress, following }) => {
  const { container } = BaseStyle;
  if (following) {
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
          width: 80,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          {following.restaurant &&
          <Image style={{ width: 25, height: 25, borderRadius: 12.5 }} source={Images.restaurant_main}/>
          }
          {following.music &&
          <Image style={{ width: 25, height: 25, borderRadius: 12.5 }} source={Images.music_main}/>
          }
          {following.book &&
          <Image style={{ width: 25, height: 25, borderRadius: 12.5 }} source={Images.book_main}/>
          }
          <View style={BaseStyle.topRightLabel}>
            <Badge primary round_micro>
              <Text>+0</Text>
            </Badge>
          </View>
        </Right>
      </ListItem>
    );
  } else {
    return (
      <ListItem avatar button onPress={onPress}>
        <Left>
          <Thumbnail small source={{ uri: user.image_thumb_url }}/>
        </Left>
        <Body style={{ borderBottomWidth: 0 }}>
        <Text numberOfLines={1}>{user.name}</Text>
        <Text note numberOfLines={1}>{user.introduce}</Text>
        </Body>
      </ListItem>
    );
  }
};

export { FollowUnitBar };
