import React from 'react';
import {
  Image
} from 'react-native';
import BaseStyle from '../../config/BaseStyle';

const ImageCon = ({ iconHeight, iconWidth, image, color }) => {
  const { container } = BaseStyle;
  const { height, width } = Image.resolveAssetSource(image);

  return (
    <Image
      source={image}
      style={{
        height: (iconHeight || 28),
        width: (iconWidth || 28) * (height / width),
        resizeMode: 'contain',
      }}
    />
  );
};

export { ImageCon };
