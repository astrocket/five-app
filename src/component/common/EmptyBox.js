import React from 'react';
import {
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Card,
  CardItem,
  Text, Body,
  Thumbnail, ListItem,
  Icon,
} from 'native-base';
import BaseStyle from '../../config/BaseStyle';

const EmptyBox = ({ id, location, title, image_url, onPress, onLongPress, barWidth, barHeight, borderRadius, marginRight, message }) => {
  const { container } = BaseStyle;
  return (
    <TouchableOpacity onPress={onPress} style={{ padding: 16 }}>
      <View style={{
        width: barWidth - 16,
        height: barHeight,
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EEE',
        borderRadius: borderRadius,
        marginRight: marginRight
      }}>
        {message ?
          <Text grey>{message}</Text>
          : <Icon
            name="ios-add-circle-outline"
            style={{
              fontSize: 40,
              color: '#FFF',
            }}
          />
        }
      </View>
    </TouchableOpacity>
  );
};

export { EmptyBox };
