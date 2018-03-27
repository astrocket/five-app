import React from 'react';
import {
  View,
} from 'react-native';
import {
  Text, ListItem, Left, Body, Icon,
} from 'native-base';
import * as Constant from '../../config/Constant';
import BaseStyle from '../../config/BaseStyle';

const ListItemIconClick = ({ icon, label, onPress, target, title }) => {
  const { container } = BaseStyle;

  return (
    target ?
      <ListItem avatar button onPress={onPress}>
        <Left>
          <View style={{ alignItems: 'center' }}>
            {icon ?
              <Icon
                name={icon}
                style={{
                  fontSize: 23,
                  borderRadius: 0,
                  color: Constant.FiveColor,
                }}
              /> : <Text small>{label}</Text>
            }
          </View>
        </Left>
        <Body style={{ borderBottomWidth: 0, flex: 1, alignItems: 'flex-end'}}>
          <Text small grey>{title}</Text>
        </Body>
      </ListItem> : null
  );
};

export { ListItemIconClick };
