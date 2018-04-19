import React from 'react';
import {
  Image,
  TouchableOpacity,
  View,
  StyleSheet
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
import * as Constant from '../../config/Constant';

const NotificationUnitBar = ({ id, user, title, created_at, onPress }) => {
  const { container } = BaseStyle;
  return (
    <ListItem avatar button onPress={onPress} transparent style={{ marginLeft: 0}}>
      <Left>
        <Thumbnail source={{ uri: user.image_url }}/>
      </Left>
      <Body style={{borderBottomWidth: 0}}>
      <Grid>
        <Row>
          <Text numberOfLines={2} style = {styles.noticeBody}>{title}</Text>
        </Row>
        <Row>
          <Text numberOfLines={1} style = {styles.noticeSub}>{created_at.split('T')[0]}</Text>
        </Row>
      </Grid>
      </Body>

    </ListItem>
  );
};


const styles = StyleSheet.create({
  noticeName: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
    color: '#333333',
    fontSize: 15,
    fontWeight: '600',
  },
  noticeBody: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
    color: '#555555',
    fontSize: 15
  },
  noticeSub: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    color: Constant.LightGrey,
    padding: 10
  },
  noticeBold: {
    alignItems: 'center',
    padding: 10
  },
})

export { NotificationUnitBar };
