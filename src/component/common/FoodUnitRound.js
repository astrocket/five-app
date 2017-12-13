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

const FoodUnitRound = ({ id, location, title, image_url, onPress, barWidth, barHeight, borderRadius, marginRight }) => {
  const { container } = BaseStyle;
  return (
    <TouchableHighlight onPress={onPress} underlayColor={'#fff'}>
      <View style={{
        width: barWidth,
        height: null, // 높이는 텍스트에 따라 자유롭게 커진다.
        marginRight: marginRight,
      }}>
        <View style={{
          width: barWidth,
          height: barHeight,
          marginBottom: 5,
        }}>
          <Image source={{ uri: image_url }} style={{
            height: null,
            width: null,
            borderRadius: borderRadius,
            flex: 1,
          }}/>
        </View>
        <View>
          <Text style={{textAlign: 'center'}} numberOfLines={1}>{location}</Text>
          <Text style={{textAlign: 'center'}} numberOfLines={1}>{title}</Text>
        </View>
      </View>
    </TouchableHighlight>
  );
};

export { FoodUnitRound };
