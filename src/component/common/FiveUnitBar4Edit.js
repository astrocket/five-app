import React from 'react';
import {
  Image, TouchableOpacity, View,
} from 'react-native';
import {
  Card, CardItem, Text, Thumbnail, ListItem,  Left,  Body,  Right
} from 'native-base';
import BaseStyle from '../../config/BaseStyle';
import * as Constant from '../../config/Constant';

import Icon from 'react-native-vector-icons/FontAwesome';

const FiveUnitBar4Edit = ({ id, subtitle, title, image_url, onPress, icon, paddingBottom, updated_at, friends_info, new_label }) => {
  const { container } = BaseStyle;

  if (updated_at) {
    return (
      <ListItem avatarList button onPress={onPress} style={{paddingBottom: paddingBottom || 40}}>
        <Image
          style={{ width: 60, height: 60, borderRadius: 16 }}
          source={{ uri: image_url }}
        />
        <Body style={{ flex: 1, height: 60, alignItems: 'flex-start', justifyContent: 'center'}}>
        <View>
          <Text normal style={{ paddingTop: 3 }} numberOfLines={1}>{title}</Text>
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
                fontSize: 40,
                color: '#EEE'
              }}
            /> : null
          }
          {new_label ?
            <Text style={{ color: Constant.FiveColor }}>●</Text> : null
          }
        </Right>
      </ListItem>
    );
  } else {
    return (
      <ListItem avatarList button onPress={onPress} style={{height: 60, width: Constant.deviceWidth, backgroundColor: 'white' }}>
        <Image
          style={{ width: 60, height: 60, borderRadius: 16, margin: 0 }}
          source={{ uri: image_url }}
        />
        <Body style={{ flex: 1, height: 60, alignItems: 'flex-start', justifyContent: 'center' }}>
          <View>
            <Text normal style={{ paddingTop: 3 }} numberOfLines={1}>{title}</Text>
            <Text note numberOfLines={1}>{subtitle}</Text>
            <Text micro yellow>{friends_info}</Text>
          </View>
        </Body>
        <Right style={{ alignItems: 'center', alignSelf: 'center' }}>
          {icon ?
            <Icon
              name={icon}
              style={{
                fontSize: 40,
                color: '#EEE'
              }}
            /> : null
          }
          {new_label ?
            <Text style={{ color: Constant.FiveColor }}>●</Text> : null
          }
        </Right>
      </ListItem>
    );
  }
};

export { FiveUnitBar4Edit };
