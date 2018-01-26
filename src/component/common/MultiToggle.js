import React from 'react';
import {
  TouchableWithoutFeedback, View, Image
} from 'react-native';
import {
  Item, Input, Text, Button
} from 'native-base';
import * as Images from '../../assets/images/Images';
import * as Constant from '../../config/Constant';
import BaseStyle from '../../config/BaseStyle';
// keyboardType = default / numeric / email-address / phone-pad
// returnKeyType = done / go / next / search / send
const ToggleButton = ({ onPress, content, clicked, image_name }) => {
  if (clicked) {
    return (
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={{ margin: 15 }}>
          <Image
            source={Images.findImageOf(image_name)}
            style={{
              height: (Constant.deviceWidth / 4) + 5,
              width: Constant.deviceWidth / 4,
              borderRadius: Constant.deviceWidth / 8
            }}
          />
          <View style={{
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 10,
            paddingBottom: 10,
            alignItems: 'center'
          }}>
            <Text style={{ color: Constant.FiveColor }}>{content}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  } else {
    return (
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={{ margin: 15 }}>
          <Image
            source={Images.findImageOf(image_name)}
            style={{
              height: (Constant.deviceWidth / 4) + 5,
              width: Constant.deviceWidth / 4,
              borderRadius: Constant.deviceWidth / 8
            }}
          />
          <View style={{
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 10,
            paddingBottom: 10,
            alignItems: 'center'
          }}>
            <Text style={{ color: Constant.GreyColor }}>{content}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }
};

const MultiToggle = ({ leftText, leftClicked, leftImage, onLeftPress, centerText, centerClicked, onCenterPress, centerImage, rightText, rightClicked, onRightPress, rightImage }) => {
  const { container } = BaseStyle;

  return (
    <Item style={{
      borderBottomWidth: 0,
      borderWidth: 0,
      backgroundColor: '#FFF',
      justifyContent: 'space-around',
      alignItems: 'center',
      height: null,
    }}>
      <ToggleButton
        onPress={onLeftPress}
        content={leftText}
        clicked={leftClicked}
        image_name={leftImage}
      />
      <ToggleButton
        onPress={onCenterPress}
        content={centerText}
        clicked={centerClicked}
        image_name={centerImage}
      />
      <ToggleButton
        onPress={onRightPress}
        content={rightText}
        clicked={rightClicked}
        image_name={rightImage}
      />
    </Item>
  );
};

export { MultiToggle };
