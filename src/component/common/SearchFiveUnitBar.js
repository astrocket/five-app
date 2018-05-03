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
        style={{ width: 64, height: 64, borderRadius: 12, marginLeft: 4, paddingTop: 4, paddingBottom: 4 }}
        source={{ uri: image_url }}
      />
    )
  } else {
    return (
      <Image
        style={{ width: 64, height: 64, borderRadius: 12, marginLeft: 4, paddingTop: 4, paddingBottom: 4 }}
        source={require('../../assets/images/five_void.png')}
      />
    )
  }
};

const SearchFiveUnitBar = ({ id, subtitle, title, onPress, onPressImage, clicked, image_url, friends_info, loading }) => {
  const { container } = BaseStyle;

  return (
    <ListItem avatarList>
      <TouchableOpacity onPress={onPressImage}>
        <FiveUnitBarImage image_url={image_url} />
      </TouchableOpacity>
      <Body>
      <View style={{ flex: 1, height: 64, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between'}}>
        <Text normal style = {{ fontWeight: `${clicked ? '600' : '100'}` }} numberOfLines={1}>{title}</Text>
        <Text note numberOfLines={1}>{subtitle}</Text>
        <Text micro yellow>{friends_info}</Text>
      </View>
      </Body>
      <Right style={{ alignItems: 'center', alignSelf: 'center' }}>
        <View style={{
          alignItems: 'center', justifyContent: 'center', padding: 2,
        }}>
          <AddSmallButton
            onPress={onPress}
            clicked={clicked}
            loading={loading}
          />
        </View>
      </Right>
    </ListItem>
  );
};

export { SearchFiveUnitBar };
