import React from 'react';
import {
  View,
} from 'react-native';
import {
  Button, Icon, Text
} from 'native-base';
import BaseStyle from '../../config/BaseStyle';

const FollowUserButton = ({ title, onPress, clicked }) => {
  const { container } = BaseStyle;
  if (clicked) {
    return (
        <Button onPress={onPress} transparent style={{ width: 100, justifyContent: 'center', alignItems: 'center'}} >
          <Text>{title}</Text>
        </Button>
    );
  } else {
    return (
        <Button onPress={onPress} transparent style={{ width: 100, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#EEE'}}>{title}</Text>
        </Button>
    );
  }

};

export { FollowUserButton };
