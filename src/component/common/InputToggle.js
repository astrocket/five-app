import React from 'react';
import {
  TouchableWithoutFeedback, View
} from 'react-native';
import {
  Item, Input, Text, Button
} from 'native-base';
import * as Constant from '../../config/Constant';
import BaseStyle from '../../config/BaseStyle';
// keyboardType = default / numeric / email-address / phone-pad
// returnKeyType = done / go / next / search / send
const ToggleButton = ({ onPress, content, clicked }) => {
  if (clicked) {
    return (
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={{
          borderWidth: 2,
          borderColor: 'transparent',
          backgroundColor: Constant.FiveColor,
          borderRadius: 18,
          paddingLeft: 20,
          paddingRight: 20,
          paddingTop: 10,
          paddingBottom: 10,
        }}>
          <Text style={{ color: 'white', fontSize: 18, fontWeight: '900' }}>{content}</Text>
        </View>
      </TouchableWithoutFeedback>
    )
  } else {
    return (
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={{
          borderWidth: 2,
          borderColor: 'transparent',
          borderRadius: 18,
          paddingLeft: 20,
          paddingRight: 20,
          paddingTop: 10,
          paddingBottom: 10,
        }}>
          <Text style={{ color: Constant.GreyColor, fontSize: 18 }}>{content}</Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }
};

const InputToggle = ({ leftText, leftClicked, onLeftPress, rightText, rightClicked, onRightPress }) => {
  const { container } = BaseStyle;

  return (
    <Item style={{
      borderBottomWidth: 0,
      borderWidth: 0,
      borderRadius: 10,
      marginBottom: 10,
      height: 50,
      backgroundColor: '#FAFAFA',
      justifyContent: 'space-around',
      alignItems: 'center',
      flex: 1,
    }}>
      <ToggleButton
        onPress={onLeftPress}
        content={leftText}
        clicked={leftClicked}
      />
      <ToggleButton
        onPress={onRightPress}
        content={rightText}
        clicked={rightClicked}
      />
    </Item>
  );
};

export { InputToggle };
