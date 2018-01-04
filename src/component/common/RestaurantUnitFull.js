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

const RestaurantUnitFull = ({ id, location, title, image_url, five_users_count, onPress, onLongPress, barWidth, barHeight, borderRadius, marginRight }) => {
  const { container } = BaseStyle;
  const deviceWidth = Dimensions.get('window').width;

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
          <Text note numberOfLines={1}>{location}</Text>
        </View>
      </View>
    </View>
  );
};

export { RestaurantUnitFull };
