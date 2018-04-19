import React from 'react';
import {
  Image, View, StyleSheet,
} from 'react-native';
import {
  Card, CardItem, Text, Thumbnail, ListItem, Left, Body, Right, Badge,
} from 'native-base';
import * as Images from '../../assets/images/Images';
import BaseStyle from '../../config/BaseStyle';
import * as Constant from '../../config/Constant';

const FollowUnitBar = ({ user, onPress, following }) => {
  const { container } = BaseStyle;
  if (following) {
    return (
      <ListItem avatar button onPress={onPress}>
        <Left>
          <Thumbnail small source={{ uri: user.image_thumb_url }}/>
        </Left>
        <Body style={{ borderBottomWidth: 0}}>
          <Text small style={styles.followUnitName} numberOfLines={1}>{user.name}</Text>
          <Text note style={styles.followUnitComment} numberOfLines={1}>{user.introduce}</Text>
        </Body>
        <Right style={{
          borderBottomWidth: 0,
          width: 80,
          flexDirection: 'row',
          justifyContent: 'flex-end',
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
        </Right>
      </ListItem>
    );
  } else {
    return (
      <ListItem avatar button onPress={onPress}>
        <Left>
          <Thumbnail small source={{ uri: user.image_thumb_url }}/>
        </Left>
        <Body style={{ borderBottomWidth: 0}}>
          <Text small style={styles.followUnitName} numberOfLines={1}>{user.name}</Text>
          <Text note style={styles.followUnitComment} numberOfLines={1}>{user.introduce}</Text>
        </Body>
      </ListItem>
    );
  }
};

const styles = StyleSheet.create({

  followUnitName: {
    color: '#333333',
    fontFamily: 'montserrat',
    fontSize: 14,
    fontWeight: '100',
    paddingTop: 3,
  },
  followUnitComment: {
    color: Constant.LightGrey,
    fontSize: 12,
    fontWeight: '100',
  },
});

export { FollowUnitBar };
