import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import {
  Icon,
  Header,
  Left,
  Body,
  Right,
  Button,
  Title,
} from 'native-base';
import BaseStyle from '../../config/BaseStyle';

// Make a component
const NavBar = ({ leftButton, leftIcon, onPressLeft, rightButton, rightIcon, onPressRight, headerText }) => {
  const { container } = BaseStyle;
  const { leftSpace, rightSpace } = styles;

  return (
    <Header rounded>
      <Left>
        {
          leftButton
            ? (
              <Button transparent onPress={onPressLeft}>
                <Icon
                  name={leftIcon}
                />
              </Button>
            )
            : (
              <View
                style={leftSpace}
              />
            )
        }
      </Left>
      <Body>
        <Title>
          {headerText}
        </Title>
      </Body>
      <Right>
        {
          rightButton
            ? (
              <Button transparent onPress={onPressRight}>
                <Icon
                  name={rightIcon}
                />
              </Button>
            )
            : (
              <View
                style={rightSpace}
              />
            )
        }
      </Right>
    </Header>
  );
};

const styles = StyleSheet.create({
  leftSpace: {
    height: 55,
    width: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightSpace: {
    height: 55,
    width: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export { NavBar };
