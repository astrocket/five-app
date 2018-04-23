import React from 'react';
import {
  Image, TouchableOpacity, View,
} from 'react-native';
import {
  Card, CardItem, Text, Thumbnail, ListItem,  Left,  Body,  Right, Icon
} from 'native-base';
import {
  AddWishSmallButton
} from './AddWishSmallButton';
import BaseStyle from '../../config/BaseStyle';

const WishUnitBar = ({ id, subtitle, title, image_url, onPressImage, onPress, icon, also_five, five_users_count }) => {
  const { container } = BaseStyle;

  return (
    <ListItem avatarList>
      <TouchableOpacity onPress={onPressImage}>
        <Image
          style={{ width: 64, height: 64, borderRadius: 12, paddingTop: 4 , paddingBottom: 4 }}
          source={{ uri: image_url }}
        />
      </TouchableOpacity>
      <Body>
      <View style={{ flex: 1, height: 64, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between'}}>
        <Text normal numberOfLines={1} style={{ margin: 1 }}>{title}</Text>
        <Text note numberOfLines={1} style={{ margin: 1 }}>{subtitle}</Text>
        <Text micro yellow>FIVE {five_users_count}</Text>
      </View>
      </Body>
      <Right style={{ alignItems: 'center', alignSelf: 'center' }}>
        <View style={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingRight: 3,
        }}>
          <AddWishSmallButton
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
