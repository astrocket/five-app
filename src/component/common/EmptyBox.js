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
} from 'native-base';
import BaseStyle from '../../config/BaseStyle';
import * as Constant from '../../config/Constant';

import Icon from 'react-native-vector-icons/FontAwesome';

const EmptyBox = ({ id, location, title, image_url, onPress, onLongPress, barWidth, barHeight, borderRadius, marginRight, message }) => {
  const { container } = BaseStyle;
  return (
    <TouchableOpacity onPress={onPress} style={{ padding: 10 }}>
      <View style={{
        width: barWidth - 20,
        height: barHeight,
        margin: 0,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fafafa',
        borderRadius: borderRadius,
        marginRight: marginRight
      }}>
        {message ?
          <Text style = {{
            color: Constant.GreyColor,
            fontSize: 14,
            fontWeight: '300'
          }}
            >{message}</Text>
          : <Icon
            name="search-plus"
            style={{
              fontSize: 36,
              color: Constant.LightGrey,
            }}
          />
        }
      </View>
    </TouchableOpacity>
  );
};

export { EmptyBox };
