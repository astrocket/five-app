import React from 'react';
import {
  View
} from 'react-native';
import {
  H3,
} from 'native-base';
import BaseStyle from '../../config/BaseStyle';
import { SmallButton } from './SmallButton';

const DeleteCategory = ({ category, title, onPress }) => {
  const { container } = BaseStyle;
  return (
    <View style={{ width: 100 }}>
      <H3 style={{ textAlign: 'center'}}>{category}</H3>
      <View style={{ flexDirection: 'row', justifyContent: 'center'}}>
        <SmallButton
          title={title}
          onPress={onPress}
        />
      </View>
    </View>
  );
};

export { DeleteCategory };
