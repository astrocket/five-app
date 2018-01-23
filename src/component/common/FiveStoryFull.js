import React from 'react';
import {
  Image,
  TouchableHighlight,
  View, Dimensions
} from 'react-native';
import {
  Card,
  CardItem,
  Text,
  Thumbnail, Button, Icon
} from 'native-base';
import * as Constant from '../../config/Constant';
import BaseStyle from '../../config/BaseStyle';

const FiveStoryFull = ({ id, subtitle, title, image_url, onPress, multiple, borderRadius, marginRight }) => {
  const { container } = BaseStyle;
  const deviceWidth = Dimensions.get('window').width;

  if (multiple) {
    return (
      <View>
        <View style={{
          flex: 1,
          flexDirection: 'column',
          width: null,
          height: null, // 높이는 텍스트에 따라 자유롭게 커진다.
          marginRight: marginRight,
          padding: 10,
          marginBottom: 10,
        }}>
          <Button transparent style={{
            flex: 1,
            width: null,
            height: null,
            marginBottom: 5,
          }} onPress={onPress}>
            <Image source={{ uri: image_url }} style={{
              height: deviceWidth - 60,
              width: deviceWidth - 60,
              borderRadius: borderRadius,
              marginBottom: 10,
              flex: 1,
            }}/>
          </Button>
          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
              <Text large numberOfLines={1}>{title}</Text>
            </View>
            <Text note numberOfLines={1}>{subtitle}</Text>
          </View>
        </View>
      </View>
    );
  } else {
    return (
      <View>
        <View style={{
          flex: 1,
          flexDirection: 'column',
          width: null,
          height: null, // 높이는 텍스트에 따라 자유롭게 커진다.
          marginRight: marginRight,
          padding: 10,
          marginBottom: 10,
        }}>
          <View style={{
            flex: 1,
            width: null,
            height: null,
            marginBottom: 5,
          }}>
            <Image source={{ uri: image_url }} style={{
              height: deviceWidth - 20,
              width: deviceWidth - 20,
              borderRadius: borderRadius,
              marginBottom: 10,
              flex: 1,
            }}/>
          </View>
          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text large numberOfLines={1}>{title}</Text>
              <Button
                onPress={onPress}
                transparent
                style={{
                  position: 'absolute',
                  right: 0,
                  top: -5,
                }}
              >
                <Icon
                  name="ios-pin"
                  style={{
                    fontSize: 25,
                    color: Constant.FiveColor,
                  }}
                />
              </Button>
            </View>
            <Text note numberOfLines={1}>{subtitle}</Text>
          </View>
        </View>
      </View>
    );
  }
};

export { FiveStoryFull };
