import React from 'react';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Text } from 'native-base';
import * as Constant from '../../config/Constant';

const BottomFullButton = ({ onPress, children, disabled }) => {
  const { buttonStyle, textStyle, disabledStyle } = styles;

  if (disabled) {
    return (
      <TouchableWithoutFeedback style={disabledStyle}>
        <Text style={textStyle}>
          {children}
        </Text>
      </TouchableWithoutFeedback>
    );
  } else {
    return (
      <TouchableOpacity onPress={onPress} style={buttonStyle}>
        <Text style={textStyle}>
          {children}
        </Text>
      </TouchableOpacity>
    );
  }
};

const styles = {
  textStyle: {
    alignSelf: 'center',
    color: Constant.FiveColor,
    fontSize: 18,
    fontWeight: '900',
    paddingTop: 15,
    paddingBottom: 15
  },
  buttonStyle: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: '#FFFFFF',
  },
  disabledStyle: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: Constant.GreyColor,
  }
};

export { BottomFullButton };
