import React from 'react';
import {
  Image,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Text,
  Thumbnail,
  ListItem,
  Left,
  Icon,
  Right,
} from 'native-base';
import BaseStyle from '../../config/BaseStyle';

const MenuBar = ({ icon, title, onPress }) => {
  const { container } = BaseStyle;
  return (
    <ListItem avatar transparent button
              onPress={onPress}
              style={{ marginLeft: 0, paddingLeft: 20, width: 200, marginTop: 10}}
    >
      <Left>
        <Icon
          name={icon}
          style={{
            fontSize: 25,
            color: '#eee',
          }}
        />
      </Left>
      <Right style={{ justifyContent: 'center', alignItems: 'flex-start', marginLeft: 10, borderBottomWidth: 0 }}>
        <Text>{title}</Text>
      </Right>
    </ListItem>
  );
};

export { MenuBar };
