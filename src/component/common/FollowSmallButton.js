import React from 'react';
import {
  Image,
} from 'react-native';
import {
  Button, Icon, Text, Spinner
} from 'native-base';
import BaseStyle from '../../config/BaseStyle';

const FollowSmallButton = ({ clicked, loading, onPress, textTrue, textFalse }) => {
  const { container } = BaseStyle;
  const {width, height} = Image.resolveAssetSource(require('../../assets/images/add_green.png'));

  if (typeof loading !== 'undefined' && loading) {
    return null;
  } else {
    if (clicked) {
      return (
        <Button transparent onPress={onPress}>
          <Image
            source={require('../../assets/images/follow_green.png')}
            style={{
              height: 25,
              width: 25 * (width / height) + 1,
            }}
          />
        </Button>
      );
    } else {
      return (
        <Button transparent onPress={onPress}>
          <Image
            source={require('../../assets/images/follow_pink.png')}
            style={{
              height: 25,
              width: 25 * (width / height) + 1,
            }}
          />
        </Button>
      );
    }
  }
};

export { FollowSmallButton };
