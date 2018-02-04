import React from 'react';
import {
  Image, TouchableOpacity, View,
} from 'react-native';
import {
  Card, CardItem, Text, Thumbnail, ListItem,  Left,  Body,  Right, Icon
} from 'native-base';
import BaseStyle from '../../config/BaseStyle';

const FiveUnitBar = ({ id, location, title, image_url, onPress, icon, five_users_count, updated_at }) => {
  const { container } = BaseStyle;

  if (updated_at) {
    return (
      <ListItem avatarList button onPress={onPress}>
        <Image
          style={{ width: 60, height: 60, borderRadius: 20 }}
          source={{ uri: image_url }}
        />
        <Body>
        <View style={{ flex: 1, height: 50, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between'}}>
          <Text normal numberOfLines={1}>{title}</Text>
          <Text note numberOfLines={1}>{location}</Text>
        </View>
        </Body>
        <Right style={{ alignItems: 'center', alignSelf: 'center' }}>
          <Text note>{updated_at.split('T')[0]}</Text>
          <Icon
            name={icon}
            style={{
              fontSize: 25,
              color: '#EEE'
            }}
          />
        </Right>
      </ListItem>
    );
  } else {
    return (
      <ListItem avatarList button onPress={onPress}>
        <Image
          style={{ width: 60, height: 60, borderRadius: 20 }}
          source={{ uri: image_url }}
        />
        <Body>
        <View style={{ flex: 1, height: 50, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between'}}>
          <Text normal numberOfLines={1}>{title}</Text>
          <Text note numberOfLines={1}>{location}</Text>
        </View>
        </Body>
        <Right style={{ alignItems: 'center', alignSelf: 'center' }}>
          <Icon
            name={icon}
            style={{
              fontSize: 25,
              color: '#EEE'
            }}
          />
        </Right>
      </ListItem>
    );
  }
};

export { FiveUnitBar };
