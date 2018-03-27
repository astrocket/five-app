import React from 'react';
import {
  TouchableOpacity, View,
} from 'react-native';
import {
  Text,
} from 'native-base';
import { Row } from 'react-native-easy-grid';
import BaseStyle from '../../config/BaseStyle';

const RowHeaderBar = ({ title, yellowLabel, onPress, moreTitle, style }) => {
  const { container } = BaseStyle;
  if (onPress) {
    return (
      <View style={[style, {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10
      }]}>
        <View style={{ flexDirection: 'row'}}>
          <Text small>{title}</Text>
          {yellowLabel ?
            <Text small yellow>{yellowLabel}</Text>
            :null}
        </View>
        <TouchableOpacity onPress={onPress} underlayColor={'#fff'}>
          <Text primary>{moreTitle}</Text>
        </TouchableOpacity>
      </View>
    )
  } else {
    return (
      <View style={[style, {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 10
      }]}>
        <Text small>{title}</Text>
      </View>
    )
  }

};

export { RowHeaderBar };
