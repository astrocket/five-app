import React from 'react';
import {
  View,
} from 'react-native';
import {
  Button, Icon, Text, Spinner
} from 'native-base';
import BaseStyle from '../../config/BaseStyle';

const FollowSmallButton = ({ clicked, onPress, textTrue, textFalse }) => {
  const { container } = BaseStyle;
  if (clicked) {
    return (
      <Button rounded micro success onPress={onPress}>
        <Text>{textTrue}</Text>
      </Button>
    );
  } else {
    return (
      <Button rounded micro onPress={onPress}>
        <Text>{textFalse}</Text>
      </Button>
    );
  }
};

export { FollowSmallButton };
