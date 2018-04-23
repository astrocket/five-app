import React from 'react';
import { Alert, Image } from 'react-native';
import {
  Toast
} from 'native-base';

export function ErrorHandler(message, onCheck, type, position) {
  if ( typeof type !== 'undefined' && type === 'toast') {
    return Toast.show({
      text: message,
      position: position || 'top',
      duration: 1500,
    });
  } else {
    return Alert.alert(
      `에러`,
      `${message}`,
      [
        {
          text: '확인',
          onPress: onCheck || null,
          style: 'cancel',
        },
      ],
      { cancelable: false },
    )
  }
}
