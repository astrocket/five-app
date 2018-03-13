import React from 'react';
import {
  View,
} from 'react-native';
import {
  Text, ListItem, Left, Body, Icon,
} from 'native-base';
import * as Constant from '../../config/Constant';
import BaseStyle from '../../config/BaseStyle';

const ListItemIconClick = ({ icon, onPress, target, title }) => {
  const { container } = BaseStyle;

  return (
    target ?
      <ListItem avatar button onPress={onPress}>
        <Left>
          <View style={{ justifyContent: 'center', alignItems: 'center', height: 36, width: 36 }}>
            <Icon
              name={icon}
              style={{
                fontSize: 25,
                borderRadius: 0,
                color: Constant.FiveColor,
              }}
            />
          </View>
        </Left>
        <Body style={{ borderBottomWidth: 0 }}>
        <Text>{title}</Text>
        </Body>
      </ListItem> : null
  );
};

export { ListItemIconClick };
