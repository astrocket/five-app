import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
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
  let dice = Math.floor(Math.random() *  4);

  return [0,1,2,3,4].map(function(index, i) {
    const five = fives[ index ];
    const five_next = fives [ index + 1 ];
    if (five) {
      if (i === dice ) {
        return (
          <View key={9999} style={{height: 100, width: null, flex: 1, marginRight: 4}}>
            <Image key={i} source={{ uri: five.image_url }} style={{height: 49, width: null, flex: 1, borderRadius: 10, marginBottom: 2 }}/>
            <Image key={i + 1} source={{ uri: five_next.image_url }} style={{height: 49, width: null, flex: 1, borderRadius: 10 }}/>
          </View>
        )
      } else if (i !== dice && i !== dice + 1) {
        return (
          <Image key={i} source={{ uri: five.image_url }} style={{height: 100, width: null, flex: 1, marginRight: 4, borderRadius: 10 }}/>
        )
      }
    } else {
      return (
        <Image key={i} source={Images.restaurant_main} style={{height: 100, width: null, flex: 1, marginRight: 4 }}/>
      )
    }
  });
};


const FivesBar = ({ image, onPress, category, followers, followees, fives }) => {
  const { container } = BaseStyle;

  return (
    <View>
      <TouchableOpacity onPress={onPress}>
        <View style={{ flexDirection: 'row', paddingLeft: 10, paddingRight: 10 }}>
          <FiveImages fives={fives} image={image} />
        </View>
      </TouchableOpacity>
      <ListItem cardStyle transparent button onPress={onPress}>
        <Thumbnail size={50} source={image}/>
        <Body>
          <Text medium>{category}</Text>
          <View style={{ flexDirection: 'row'}}>
            <Text small style={{ marginRight: 0 }}>{Number(followers).toLocaleString()}</Text>
            <Text note>{'Follower'}</Text>
            <Text small style={{ marginRight: 0 }}>{Number(followees).toLocaleString()}</Text>
            <Text note>{'Following'}</Text>
          </View>
        </Body>
      </ListItem>
    </View>
  );
};

export { FivesBar };
