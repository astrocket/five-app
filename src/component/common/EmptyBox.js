import React from 'react';
import {
  TouchableHighlight,
  View,
} from 'react-native';
import {
  Card,
  CardItem,
  Text,
  Thumbnail,
  Icon,
} from 'native-base';
import BaseStyle from '../../config/BaseStyle';

const EmptyBox = ({ id, location, title, image_url, onPress, onLongPress, barWidth, barHeight, borderRadius, marginRight }) => {
  const { container } = BaseStyle;
  return (
    <TouchableHighlight onPress={onPress} onLongPress={onLongPress} underlayColor={'#fff'}>
      <View style={{
        width: barWidth,
        height: null, // 높이는 텍스트에 따라 자유롭게 커진다.
        marginRight: marginRight,
        borderWidth: 1,
        borderColor: '#eee'
      }}>
        <View style={{
          width: barWidth,
          height: barHeight,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Icon
            name="ios-add-circle-outline"
            style={{
              fontSize: 50,
              color: '#eee',
            }}
          />
        </View>
      </View>
    </TouchableHighlight>
  );
};

export { EmptyBox };
