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
  Toast,
} from 'native-base';
import BaseStyle from '../../config/BaseStyle';

const InviteBox = ({ used, marginLeft, marginRight, onPress }) => {
  const { container } = BaseStyle;
  if (used) {
    return (
      <TouchableHighlight underlayColor={'#fff'} onPress={()=> Toast.show({
        text: '이미 사용하신 추천 카드입니다.',
        position: 'bottom',
        duration: 1500
      })} >
        <View style={{
          width: null,
          height: 100, // 높이는 텍스트에 따라 자유롭게 커진다.
          marginRight: marginRight,
          marginLeft: marginLeft,
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: '#eee'
        }}>
          <Icon
            name="ios-heart-outline"
            style={{
              fontSize: 50,
              color: '#eee',
            }}
          />
        </View>
      </TouchableHighlight>
    );
  } else {
    return (
      <TouchableHighlight onPress={onPress} underlayColor={'#fff'}>
        <View style={{
          width: null,
          height: 100, // 높이는 텍스트에 따라 자유롭게 커진다.
          marginRight: marginRight,
          marginLeft: marginLeft,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#FF9800',
          borderWidth: 1,
          borderColor: '#eee'
        }}>
          <Icon
            name="ios-heart-outline"
            style={{
              fontSize: 50,
              color: '#eee',
            }}
          />
        </View>
      </TouchableHighlight>
    );
  }
};

export { InviteBox };
