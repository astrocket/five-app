import React from 'react';
import {
  Image,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Text,
  Thumbnail,
  ListItem,
  Left,
  Body,
  Right,
} from 'native-base';
import BaseStyle from '../../config/BaseStyle';

const UserUnitBar = ({ id, name, image_url, onPress, introduce, followees_count, followers_count, updated_at }) => {
  const { container } = BaseStyle;
  return (
    <ListItem avatarList button onPress={onPress} transparent>
      <Left>
        <Thumbnail source={{ uri: image_url }}/>
      </Left>
      <Body style={{ borderBottomWidth: 0 }}>
      <Text>{name}</Text>
      <View style={{ flexDirection: 'row'}}>
        <Text small style={{ marginRight: 0 }}>{Number(followers_count).toLocaleString()}</Text>
        <Text note>{' 팔로워'}</Text>
        <Text small style={{ marginRight: 0 }}>{Number(followees_count).toLocaleString()}</Text>
        <Text note>{' 팔로잉'}</Text>
      </View>
      </Body>
      <Right style={{ borderBottomWidth: 0 }}>
        {updated_at ?
          <Text note>{updated_at.split('T')[0]}</Text>
        :null}
      </Right>
    </ListItem>
  );
};

export { UserUnitBar };
