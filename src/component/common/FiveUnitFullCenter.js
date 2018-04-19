import React from 'react';
import {
  Image,
  TouchableHighlight,
  View, Dimensions,
} from 'react-native';
import {
  Card,
  CardItem,
  Text,
  Thumbnail, Button, Icon,
} from 'native-base';
import {
  Col, Row, Grid,
} from 'react-native-easy-grid';
import * as Constant from '../../config/Constant';
import BaseStyle from '../../config/BaseStyle';

const FiveUnitFullCenter = ({ id, subtitle, title, image_url, friends_info, onPress, multiple, borderRadius, marginRight, cardCut }) => {
  const { container } = BaseStyle;
  const deviceWidth = Dimensions.get('window').width;

  if (multiple) {
    return (
      <Grid style={{
          backgroundColor: '#fafafa',
          height: 400,
          width: Constant.deviceWidth,
          justifyContent: 'center',
          marginBottom: 0,
        }}>
        <Col style = {{ width: 16, backgroundColor: 'white', borderTopRightRadius: 12, borderBottomRightRadius: 12 }}>
        </Col>
        <Col style = {{ width: (Constant.deviceWidth - 292) / 2 - 16, backgroundColor: '#fafafa' }}>
        </Col>
        <Col style={{ backgroundColor: 'white', borderRadius: 16 }}>
          <Row size={70}
            style={{
            width: 292,
            borderRadius: 12,
            padding: 16,
            }}>
            <Button transparent style={{
              flex: 1,
              height: 260,
              width: 260,
              marginBottom: 0,
              borderRadius: 3
              }} onPress={onPress}>
              <Image 
                source={{ uri: image_url }}
                style={{
                  height: 260,
                  width: 260,
                  borderRadius: 3,
                  resizeMode: 'contain'
              }}/>
            </Button>
          </Row>
          <Row size={9} style={{ justifyContent: 'center', padding: 12, backgroundColor: 'white' }}>
            <Text large numberOfLines={1}>{title}</Text>
          </Row>
          <Row size={7} style={{ width: 260, justifyContent: 'center', marginRight: 20, marginLeft: 20 }}>
            <Text note numberOfLines={1}>{subtitle}</Text>
          </Row>
          <Row size={14} style={{ justifyContent: 'center' }}>
            <Text micro yellow>{friends_info}</Text>
          </Row>
        </Col>
        <Col style = {{ width: (Constant.deviceWidth - 292) / 2 - 16, backgroundColor: '#fafafa' }}>
        </Col>          
        <Col style = {{ width: 16, backgroundColor: 'white', borderTopLeftRadius: 12, borderBottomLeftRadius: 12 }}>
        </Col>
      </Grid>
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
          marginBottom: 10,
        }}>
          <View>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
              <Text large numberOfLines={1}>{title}</Text>
            </View>
            <Text note numberOfLines={1}>{subtitle}</Text>
          </View>
        </View>
        <View style={{
          flex: 1,
          width: null,
          height: null,
          marginBottom: 5,
          justifyContent: 'center',
        }}>
          <Image source={{ uri: image_url }} style={{
            height: deviceWidth - 20,
            width: deviceWidth - 20,
            borderRadius: borderRadius,
            marginBottom: 10,
            flex: 1,
          }}/>
        </View>
      </View>
    );
  }
};

export { FiveUnitFullCenter };
