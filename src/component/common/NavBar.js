import React from 'react';
import {
  View, StyleSheet, Image,
} from 'react-native';
import {
  Icon, Header, Left, Body, Right, Button, Title,
} from 'native-base';
import { ImageCon } from './';
import BaseStyle from '../../config/BaseStyle';
import * as Constant from '../../config/Constant';

const NavBar = ({ category, statusBar, hasTabs, backgroundImage, onPressLeft, leftButton, leftAsImage, leftIcon, leftIconColor, onPressRight, rightButton, rightAsImage, rightIcon, rightIconColor, headerText }) => {
  const { container } = BaseStyle;
  const { leftSpace, rightSpace } = styles;

  if (backgroundImage) {
    return (
      <View style={{ height: (category === 'book' ? 260 : 240), backgroundColor: Constant.LightGrey }}>
        {backgroundImage ?
            <Image
              style={{
                flex: 1,
                resizeMode: (category === 'book' ? 'contain' : 'cover'),
                position: 'absolute',
                top: 0,
                left: 0,
                width: Constant.deviceWidth,
                height: '100%',
              }}
              source={backgroundImage}
            />
          : null
        }
        <Header
          rounded
          iosBarStyle={statusBar}
          style={{
            backgroundColor: 'transparent',
            borderBottomWidth: 0,
            elevation: 0,
          }}
        >
          <Left>
            {
              leftButton ? (
                  <Button transparent onPress={onPressLeft}>
                    {
                      leftAsImage ?
                        <ImageCon
                          image={leftIcon}
                        />
                        : <Icon
                          name={leftIcon}
                          style={{
                            fontSize: 25,
                            color: leftIconColor || Constant.FiveColor,
                          }}/>
                    }
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
                    {
                      rightAsImage ?
                        <ImageCon
                          image={rightIcon}
                        />
                        : <Icon
                          name={rightIcon}
                          style={{
                            fontSize: 28,
                            color: rightIconColor || Constant.FiveColor,
                          }}/>
                    }
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
      </View>
    );
  } else {
    return (
      <Header
        hasTabs={hasTabs}
        iosBarStyle={statusBar}
        style={{
          backgroundColor: '#FFF',
          borderBottomWidth: 0,
          elevation: 0,
        }}
      >
        <Left>
          {
            leftButton
              ? (
                <Button transparent onPress={onPressLeft}>
                  {
                    leftAsImage ?
                      <ImageCon
                        image={leftIcon}
                      />
                      : <Icon
                        name={leftIcon}
                        style={{
                          fontSize: 25,
                          color: leftIconColor || Constant.FiveColor,
                        }}/>
                  }
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
                  {
                    rightAsImage ?
                      <ImageCon
                        image={rightIcon}
                      />
                      : <Icon
                        name={rightIcon}
                        style={{
                          fontSize: 28,
                          color: rightIconColor || Constant.FiveColor,
                        }}/>
                  }
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
  }
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
