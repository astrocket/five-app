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
import * as Constant from '../../config/Constant';

const UserUnitRound = ({ id, name, image_url, large, onPress, barWidth, barHeight, borderRadius, marginRight, fontSize }) => {
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
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: borderRadius,
          marginBottom: 15,
        }}>
          <Image source={{ uri: image_url }} style={{
            width: barWidth - 4,
            height: barHeight - 4,
            borderRadius: borderRadius - 2,
          }}/>
        </View>
        <View>
          <Text style={{
            color: '#333333',
            textAlign: 'center',
            fontSize: fontSize,
          }} large={large} numberOfLines={1}>{name}</Text>
        </View>
      </View>
    </TouchableHighlight>
  );
};

export { UserUnitRound };
