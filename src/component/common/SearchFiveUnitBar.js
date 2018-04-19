import React from 'react';
import {
  Image, TouchableOpacity, View,
} from 'react-native';
import {
  AddSmallButton
} from './AddSmallButton';
import * as Images from '../../assets/images/Images';
import {
  Card, CardItem, Text, Thumbnail, ListItem,  Left,  Body,  Right, Icon
} from 'native-base';
import BaseStyle from '../../config/BaseStyle';

const FiveUnitBarImage = ({ image_url }) => {
  if (image_url) {
    return (
      <Image
        style={{ width: 56, height: 56, borderRadius: 10 }}
        source={{ uri: image_url }}
      />
    )
  } else {
    return (
      <Image
        style={{ width: 56, height: 56, borderRadius: 10 }}
        source={require('../../assets/images/five_void.png')}
      />
    )
  }
};

const SearchFiveUnitBar = ({ id, subtitle, title, onPress, onPressImage, clicked, image_url, friends_info  }) => {
  const { container } = BaseStyle;

  if (clicked) {
    return (
      <ListItem avatarList style={{ height: 76, marginLeft: 12, marginTop: 4 }}>
        <TouchableOpacity onPress={onPressImage}>
          <FiveUnitBarImage image_url={image_url} />
        </TouchableOpacity>
        <Body>
        <View style={{ flex: 1, height: 56, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between'}}>
          <Text normal style = {{ fontWeight: '900', padding: 1 }} numberOfLines={1}>{title}</Text>
          <Text note numberOfLines={1}>{subtitle}</Text>
          <Text micro yellow>{friends_info}</Text>
        </View>
        </Body>
        <Right style={{ alignItems: 'center', alignSelf: 'center' }}>
          <View style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingRight: 5,
          }}>
            <AddSmallButton
              onPress={onPress}
              textTrue={'담김'}
              textFalse={'+ 담기'}
              clicked={clicked}
            />
          </View>
        </Right>
      </ListItem>
    );
  } else {
    return (
      <ListItem avatarList style={{ height: 76, marginLeft: 12, marginTop: 4 }}>
        <TouchableOpacity onPress={onPressImage}>
          <FiveUnitBarImage image_url={image_url} />
        </TouchableOpacity>
        <Body>
        <View style={{ flex: 1, height: 56, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between'}}>
          <Text normal style = {{ fontWeight: '100', padding: 1 }} numberOfLines={1}>{title}</Text>
          <Text note numberOfLines={1}>{subtitle}</Text>
          <Text micro yellow>{friends_info}</Text>
        </View>
        </Body>
        <Right style={{ alignItems: 'center', alignSelf: 'center' }}>
          <View style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingRight: 5,
          }}>
            <AddSmallButton
              onPress={onPress}
              textTrue={'담김'}
              textFalse={'+ 담기'}
              clicked={clicked}
            />
          </View>
        </Right>
      </ListItem>
    );
  }
};

export { SearchFiveUnitBar };
