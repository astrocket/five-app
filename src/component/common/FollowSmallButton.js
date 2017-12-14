import React from 'react';
import {
  Button, Icon,
} from 'native-base';
import BaseStyle from '../../config/BaseStyle';

const FollowSmallButton = ({ icon, onPress, clicked }) => {
  const { container } = BaseStyle;
  if (clicked) {
    return (
      <Button
        onPress={onPress}
        style={{ width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' }}
      >
        <Icon
          name={icon}
          style={{
            fontSize: 20,
            color: '#eee',
          }}
        />
      </Button>
    );
  } else {
    return (
      <Button
        onPress={onPress}
        transparent
        style={{ width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' }}
      >
        <Icon
          name={icon}
          style={{
            fontSize: 20,
            color: '#eee',
          }}
        />
      </Button>
    );
  }

};

export { FollowSmallButton };
