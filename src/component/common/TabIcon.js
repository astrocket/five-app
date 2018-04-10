import React from 'react';
import {
  Image
} from 'react-native';
import BaseStyle from '../../config/BaseStyle';

const TabIcon = ({ iconHeight, imageGrey, imagePink, tintColor }) => {
  const { container } = BaseStyle;
  const { height, width } = Image.resolveAssetSource(imageGrey);

  if (tintColor === '#9e9e9e') {
    return (
      <Image
        source={imageGrey}
        style={{
          height: (iconHeight || 25),
          width: (iconHeight || 25) * (height / width) + 1,
        }}
      />
    );
  } else {
    return (
      <Image
        source={imagePink}
        style={{
          height: (iconHeight || 25),
          width: (iconHeight || 25) * (height / width) + 1,
        }}
      />
    );
  }
};

export { TabIcon };
