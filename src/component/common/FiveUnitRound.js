import React from 'react';
import {
  Image,
  TouchableHighlight,
  View,
} from 'react-native';
import {
  Card,
  CardItem,
  Text,
  Thumbnail,
} from 'native-base';
import BaseStyle from '../../config/BaseStyle';

const FiveUnitRound = ({ category, id, subtitle, title, image_url, five_users_count, onPress, onLongPress, barWidth, barHeight, borderRadius, marginRight }) => {
  const { container } = BaseStyle;
  return (
    <TouchableHighlight onPress={onPress} onLongPress={onLongPress} underlayColor={'#fff'}>
      <View style={{
        width: (category === 'book' ? 140 : 156),
        height: null, // 높이는 텍스트에 따라 자유롭게 커진다.
        marginRight: marginRight,
      }}>
        <View style={{
          width: (category === 'book' ? 140 : 156),
          height: (category === 'book' ? 200 : 156),
          marginBottom: 5,
        }}>
          <Image source={{ uri: image_url }} style={{
            height: (category === 'book' ? 200 : 156),
            width: (category === 'book' ? 140 : 156),
            borderRadius: borderRadius,
            marginRight: marginRight,
            flex: 1,
            resizeMode: (category === 'book' ? 'contain' : 'cover'),
          }}/>
        </View>
        <View>
          <Text small numberOfLines={1}>{title}</Text>
          <Text note numberOfLines={1}>{subtitle}</Text>
          <Text micro yellow>FIVE {five_users_count}</Text>
        </View>
      </View>
    </TouchableHighlight>
  );
};

export { FiveUnitRound };
