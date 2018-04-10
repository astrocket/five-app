import React from 'react';
import {
  View,
  TouchableOpacity,
} from 'react-native';
import {
  H3,
  Text
} from 'native-base';
import BaseStyle from '../../config/BaseStyle';

const FollowerInfo = ({ onPress, category, followees, followers }) => {
  const { container } = BaseStyle;
  return (
    <View style={{ width: 100 }}>
      <TouchableOpacity onPress={onPress}>
        <H3 style={{ textAlign: 'center'}}>{category}</H3>
        <View style={{ flexDirection: 'row', justifyContent: 'center'}}>
          <Text style={{ fontWeight: '500' }}>{followees}</Text><Text note style={{ fontSize: 11, paddingTop: 2 }}> 팔로잉</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center'}}>
          <Text style={{ fontWeight: '500' }}>{followers}</Text><Text note style={{ fontSize: 11, paddingTop: 2 }}> 팔로워</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export { FollowerInfo };
