import React from 'react';
import {
  Image, TouchableOpacity, View,
} from 'react-native';
import {
  Card, CardItem, Text, Thumbnail, ListItem,  Left,  Body,  Right, Icon
} from 'native-base';
import BaseStyle from '../../config/BaseStyle';

const FiveUnitBar = ({ id, subtitle, title, image_url, onPress, icon, paddingBottom, updated_at, friends_info, new_label }) => {
  const { container } = BaseStyle;

  if (updated_at) {
    return (
      <ListItem avatarList button onPress={onPress} style={{paddingBottom: paddingBottom || 10}}>
        <Image
          style={{ width: 60, height: 60, borderRadius: 20 }}
          source={{ uri: image_url }}
        />
        <Body style={{ flex: 1, height: 52, alignSelf: 'stretch', justifyContent: 'center' }}>
        <View>
          <Text normal numberOfLines={1}>{title}</Text>
          <Text note numberOfLines={1}>{subtitle}</Text>
          <Text micro yellow>{friends_info}</Text>
        </View>
        </Body>
        <Right style={{ alignItems: 'center', alignSelf: 'center' }}>
          <Text note>{updated_at.split('T')[0]}</Text>
          {icon ?
            <Icon
              name={icon}
              style={{
                fontSize: 25,
                color: '#EEE'
              }}
            /> : null
          }
          {new_label ?
            <Text>new</Text> : null
          }
        </Right>
      </ListItem>
    );
  } else {
    return (
      <ListItem avatarList button onPress={onPress} style={{paddingBottom: paddingBottom || 10}}>
        <Image
          style={{ width: 60, height: 60, borderRadius: 20 }}
          source={{ uri: image_url }}
        />
        <Body style={{ flex: 1, height: 52, alignSelf: 'stretch', justifyContent: 'center' }}>
          <View>
            <Text normal numberOfLines={1}>{title}</Text>
            <Text note numberOfLines={1}>{subtitle}</Text>
            <Text micro yellow>{friends_info}</Text>
          </View>
        </Body>
        <Right style={{ alignItems: 'center', alignSelf: 'center' }}>
          {icon ?
            <Icon
              name={icon}
              style={{
                fontSize: 25,
                color: '#EEE'
              }}
            /> : null
          }
          {new_label ?
            <Text style={{ color: 'red' }}>new</Text> : null
          }
        </Right>
      </ListItem>
    );
  }
};

export { FiveUnitBar };
