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
    <ListItem avatar button onPress={onPress} transparent style={{ marginLeft: 6}}>
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
    padding: 8,
    color: '#333333',
    fontSize: 16,
    fontWeight: '600',
  },
  noticeBody: {
    flex: 1,
    padding: 4,
    paddingRight: 12, 
    color: '#555555',
    fontSize: 16,
  },
  noticeSub: {
    alignItems: 'center',
    color: Constant.LightGrey,
    padding: 4,
  },
  noticeBold: {
    alignItems: 'center',
    padding: 8,
  },
})

export { NotificationUnitBar };
