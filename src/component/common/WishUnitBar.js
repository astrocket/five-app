import React from 'react';
import {
  Image, TouchableOpacity, View,
} from 'react-native';
import {
  Card, CardItem, Text, Thumbnail, ListItem,  Left,  Body,  Right, Icon
} from 'native-base';
import {
  FollowSmallButton
} from './FollowSmallButton';
import BaseStyle from '../../config/BaseStyle';

const WishUnitBar = ({ id, subtitle, title, image_url, onPress, icon, also_five, updated_at }) => {
  const { container } = BaseStyle;

  return (
    <ListItem avatarList button onPress={onPress}>
      <Image
        style={{ width: 60, height: 60, borderRadius: 20 }}
        source={{ uri: image_url }}
      />
      <Body>
      <View style={{ flex: 1, height: 60, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between'}}>
        <Text note numberOfLines={1}>{updated_at.split('T')[0]}</Text>
        <Text normal numberOfLines={1} style={{ marginBottom: 0 }}>{title}</Text>
        <Text note numberOfLines={1}>{subtitle}</Text>
      </View>
      </Body>
      <Right style={{ alignItems: 'center', alignSelf: 'center' }}>
        <View style={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingRight: 5,
        }}>
          <FollowSmallButton
            onPress={onPress}
            textTrue={'담김'}
            textFalse={'+ 담기'}
            clicked={also_five}
          />
        </View>
      </Right>
    </ListItem>
  );

};

export { WishUnitBar };
