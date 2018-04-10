import React from 'react';
import {
  Button,
  Text,
} from 'native-base';
import BaseStyle from '../../config/BaseStyle';

const SmallButton = ({ title, onPress, clicked }) => {
  const { container } = BaseStyle;
  {
    if (clicked) {
      return (
        <Button block small warning
                onPress={onPress}
                style={{ borderRadius: 5, paddingTop: 2, margin: 10, width: 100, justifyContent: 'center' }}
        >
          <Text>{title}</Text>
        </Button>
      );
    } else {
      return (
        <Button bordered small danger
                onPress={onPress}
                style={{ borderRadius: 5, paddingTop: 2, margin: 10, width: 100, justifyContent: 'center' }}
        >
          <Text>{title}</Text>
        </Button>
      );
    }
  }

};

export { SmallButton };
