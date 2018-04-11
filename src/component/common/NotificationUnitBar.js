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
  Icon,
} from 'native-base';
import {
  Col,
  Row,
  Grid,
} from 'react-native-easy-grid';
import BaseStyle from '../../config/BaseStyle';

const NotificationUnitBar = ({ id, user, title, created_at, onPress }) => {
  const { container } = BaseStyle;
  return (
    <ListItem avatar button onPress={onPress} transparent style={{ marginLeft: 0}}>
      <Left>
        <Thumbnail small source={{ uri: user.image_url }}/>
      </Left>
      <Body style={{borderBottomWidth: 1}}>
      <Grid>
        <Row>
          <Text numberOfLines={2}>{title}</Text>
        </Row>
        <Row style={{ justifyContent: 'flex-start'}}>
          <Text note numberOfLines={1}>{created_at.split('T')[0]}</Text>
        </Row>
      </Grid>
      </Body>
      <Right>
        <Text note><Text note numberOfLines={1}>{created_at.split('T')[0]}</Text></Text>
      </Right>
    </ListItem>
  );
};

export { NotificationUnitBar };
