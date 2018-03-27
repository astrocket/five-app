import React from 'react';
import {
  Image
} from 'react-native';
import BaseStyle from '../../config/BaseStyle';

const ImageCon = ({ iconHeight, image }) => {
  const { container } = BaseStyle;
  const { height, width } = Image.resolveAssetSource(image);

  return (
    <Image
      source={image}
      style={{
        height: (iconHeight || 25),
        width: (iconHeight || 25) * (height / width) + 1,
      }}
    />
  );
};

export { ImageCon };
