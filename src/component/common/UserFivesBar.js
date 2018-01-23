import React from 'react';
import { View, Image, TouchableOpacity, Dimensions } from 'react-native';
import {
  Card,
  CardItem,
  Text,
  Thumbnail,
  ListItem,
  Left,
  Body,
  Right,
  Badge
} from 'native-base';
import * as Images from '../../assets/images/Images';
import BaseStyle from '../../config/BaseStyle';

const FiveImages = ({ fives, image }) => {
  let dice = Math.floor(Math.random() *  (fives.length - 1));

  return [0,1,2,3,4].map(function(index, i) {
    const five = fives[ index ];
    const five_next = fives[ index + 1 ];
    if (five) {
      if (i === dice && fives.length > 1 ) {
        return (
          <View key={9999} style={{ height: 100, width: null, flex: 1, marginRight: 4 }}>
            <Image key={i} source={{ uri: five.image_medium_url }} style={{height: 49, width: null, flex: 1, borderRadius: 10, marginBottom: 2 }}/>
            <Image key={i + 1} source={{ uri: five_next.image_medium_url }} style={{height: 49, width: null, flex: 1, borderRadius: 10 }}/>
          </View>
        )
      } else if ((i !== dice && i === dice + 1) || fives.length === 2) {
        return null;
      } else {
        return (
          <Image key={i} source={{ uri: five.image_medium_url }} style={{height: 100, width: null, flex: 1, marginRight: 4, borderRadius: 10 }}/>
        )
      }
    } else {
      return (
        <Image key={i} source={Images.restaurant_main} style={{height: 100, width: null, flex: 1, marginRight: 4 }}/>
      )
    }
  });
};


const UserFivesBar = ({ image, onPress, category, followers, followees, fives, user }) => {
  const { container } = BaseStyle;
  const deviceWidth = Dimensions.get('window').width;

  return (
    <View>
      <TouchableOpacity onPress={onPress}>
        <View style={{ flexDirection: 'row', paddingLeft: 10, paddingRight: 10, height: null,
          width: deviceWidth - 60,
          marginBottom: 10,
          flex: 1, }}>
          <FiveImages fives={fives} image={image} />
        </View>
      </TouchableOpacity>
      <ListItem cardStyle transparent button onPress={onPress}>
        <Thumbnail small source={{ uri: user.image_url}}/>
        <Body>
        <View style={{ flexDirection: 'row'}}>
          <Text note>{user.name}의</Text>
        </View>
        <Text medium>{category}</Text>
        </Body>
      </ListItem>
    </View>
  );
};

export { UserFivesBar };
