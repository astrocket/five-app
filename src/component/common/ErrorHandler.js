import React from 'react';
import { Alert } from 'react-native';
import {
  Toast
} from 'native-base';
import * as Constant from '../../config/Constant';
import BaseStyle from '../../config/BaseStyle';

const ErrorHandler = ({ type, message, position, onCheck }) => {

  if (type === 'alert') {
    return Alert.alert(
      `에러`,
      `${message}`,
      [
        {
          text: '확인',
          onPress: onCheck,
          style: 'cancel',
        },
      ],
      { cancelable: false },
    )
  } else {
    return Toast.show({
      text: message,
      position: position || 'top',
      duration: 1500,
    });
  }
};

export { ErrorHandler }