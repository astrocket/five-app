import React from 'react';
import {
  TouchableOpacity,
} from 'react-native';
import {
  Item, Input, Text,
} from 'native-base';
import * as Constant from '../../config/Constant';
import BaseStyle from '../../config/BaseStyle';
// keyboardType = default / numeric / email-address / phone-pad
// returnKeyType = done / go / next / search / send
const InputSingle = ({ placeholder, autoFocus, submitText, onSubmitPress, onSubmitEditing, onChangeText, secureTextEntry, keyboardType, returnKeyType, noButton }) => {
  const { container } = BaseStyle;
  if (noButton) {
    return (
      <Item style={{
        borderBottomWidth: 0,
        borderWidth: 0,
        borderRadius: 10,
        marginBottom: 10,
        backgroundColor: '#FAFAFA',
        flex: 1,
      }}>
        <Input
          placeholder={placeholder}
          placeholderTextColor={'#A1A1A1'}
          onChangeText={onChangeText}
          autoCapitalize={'none'}
          autoCorrect={false}
          autoFocus={autoFocus}
          multiline={false}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          style={{
            fontSize: 15,
            color: Constant.GreyColor,
            paddingLeft: 10,
            paddingRight: 10,
          }}
        />
      </Item>
    );
  } else {
    return (
      <Item style={{
        borderBottomWidth: 0,
        borderWidth: 0,
        borderRadius: 10,
        backgroundColor: '#FAFAFA',
      }}>
        <Input
          placeholder={placeholder}
          placeholderTextColor={'#A1A1A1'}
          onChangeText={onChangeText}
          autoCapitalize={'none'}
          autoCorrect={false}
          autoFocus={autoFocus}
          multiline={false}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          style={{
            fontSize: 15,
            color: Constant.GreyColor,
            paddingLeft: 10,
            paddingRight: 10,
          }}
        />
        <TouchableOpacity
          onPress={onSubmitPress}
          style={{
            padding: 10,
          }}>
          <Text primary>{submitText}</Text>
        </TouchableOpacity>
      </Item>
    );
  }
};

export { InputSingle };
