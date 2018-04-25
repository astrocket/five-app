import React from 'react';
import {
  Image,
} from 'react-native';
import {
  Button, Icon, Text, Spinner
} from 'native-base';
import BaseStyle from '../../config/BaseStyle';

const AddWishSmallButton = ({ clicked, onPress, textTrue, textFalse, loading }) => {
  const { container } = BaseStyle;
  const {width, height} = Image.resolveAssetSource(require('../../assets/images/add_green.png'));
  if (typeof loading !== 'undefined' && loading) {
    return (
      <Button transparent>
        <Image
          source={require('../../assets/images/add_five_loading.png')}
          style={{
            height: 25,
            width: 25 * (width / height) + 5,
          }}
        />
      </Button>
    );
  } else {
    if (clicked) {
      return (
        <Button transparent onPress={onPress}>
          <Image
            source={require('../../assets/images/add_five_green.png')}
            style={{
              height: 25,
              width: 25 * (width / height) + 5,
            }}
          />
        </Button>
      );
    } else {
      return (
        <Button transparent onPress={onPress}>
          <Image
            source={require('../../assets/images/add_five_pink.png')}
            style={{
              height: 25,
              width: 25 * (width / height) + 5,
            }}
          />
        </Button>
      );
    }
  }
};

export { AddWishSmallButton };
