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
    <ListItem button onPress={onPress} transparent style={{ marginLeft: 0, paddingLeft: 20, width: 300, paddingTop: 10, paddingBottom: 10}}>
      <Grid>
        <Row>
          <Text numberOfLines={2}>{title}</Text>
        </Row>
        <Row style={{ justifyContent: 'flex-end'}}>
          <Text note numberOfLines={1}>{created_at.split('T')[0]}</Text>
        </Row>
      </Grid>
    </ListItem>
  );
};

export { NotificationUnitBar };
