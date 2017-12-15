import React from 'react';
import {
  View,
} from 'react-native';
import {
  Button, Icon,
} from 'native-base';
import BaseStyle from '../../config/BaseStyle';

const FollowSmallButton = ({ icon, clicked }) => {
  const { container } = BaseStyle;
  if (clicked) {
    return (
      <View
        style={{ backgroundColor: '#123' ,width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' }}
      >
        <Icon
          name={icon}
          style={{
            fontSize: 20,
            color: '#eee',
          }}
        />
      </View>
    );
  } else {
    return (
      <View
        style={{ width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' }}
      >
        <Icon
          name={icon}
          style={{
            fontSize: 20,
            color: '#eee',
          }}
        />
      </View>
    );
  }

};

export { FollowSmallButton };
