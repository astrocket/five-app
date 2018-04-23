import React from 'react';
import {
  Image,
} from 'react-native';
import {
  Button, Icon, Text, Spinner
} from 'native-base';
import BaseStyle from '../../config/BaseStyle';

const AddSmallButton = ({ clicked, onPress }) => {
  const { container } = BaseStyle;
  const {width, height} = Image.resolveAssetSource(require('../../assets/images/add_five_green.png'));

  if (typeof loading !== 'undefined' && loading) {
    return null;
  } else {
    if (clicked) {
      return (
      <Button transparent small onPress={onPress}>
        <Image
          source={require('../../assets/images/add_five_green.png')}
          style={{
            height: 26,
            width: 26 * (width / height),
          }}
        />
      </Button>
      );
    } else {
      return (
      <Button transparent small onPress={onPress}>
        <Image
          source={require('../../assets/images/add_five_pink.png')}
          style={{
            height: 26,
            width: 26 * (width / height),
          }}
        />
      </Button>
      );
    }
  }
};

export { AddSmallButton };
