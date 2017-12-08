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

const FoodUnitRound = ({ id, location, title, image_url, onPress, barWidth, barHeight, borderRadius }) => {
  const {} = BaseStyle;
  return (
    <TouchableHighlight onPress={onPress} underlayColor={'#fff'}>
      <View style={{
        width: barWidth,
        height: null, // 높이는 텍스트에 따라 자유롭게 커진다.
        marginRight: 10,
      }}>
        <View style={{
          width: barWidth,
          height: barHeight,
        }}>
          <Image source={{ uri: image_url }} style={{
            height: null,
            width: null,
            marginBottom: 5,
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
