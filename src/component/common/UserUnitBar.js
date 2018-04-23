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

const ImagePerRole = ({ user }) => {
  return user.roles.map(function (role) {
    return (
      <Image key={`${user.id}-${role}`} style={{ width: 25, height: 25, borderRadius: 12.5 }} source={Images.findImageOf(role)}/>
    )
  });
};

const UserUnitBar = ({ user, onPress }) => {
  const { container } = BaseStyle;
  if (user.roles.length > 0) {
    return (
      <ListItem avatar button onPress={onPress}>
        <Left>
          <Thumbnail small style={{ marginLeft: 4 }} source={{ uri: user.image_thumb_url }}/>
        </Left>
        <Body style={{ borderBottomWidth: 0 }}>
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
          <ImagePerRole user={user}/>
        </Right>
      </ListItem>
    );
  } else {
    return (
      <ListItem avatar button onPress={onPress}>
        <Left>
          <Thumbnail small style={{ marginLeft: 4 }} source={{ uri: user.image_thumb_url }}/>
        </Left>
        <Body style={{ borderBottomWidth: 0 }}>
        <Text numberOfLines={1}>{user.name}</Text>
        <Text note numberOfLines={1}>{user.introduce}</Text>
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

export { UserUnitBar };
