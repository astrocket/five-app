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

const FiveUnitFullCenter = ({ id, category, subtitle, title, image_url, friends_info, onPress, multiple, borderRadius, marginRight, cardCut }) => {
  const { container } = BaseStyle;
  const deviceWidth = Dimensions.get('window').width;

  if (multiple) {
    let fiveHeight = 400;
    let fiveCardWidth = 292;

    return (
      <Grid style={{
          backgroundColor: '#fafafa',
          height: fiveHeight,
          width: Constant.deviceWidth,
          justifyContent: 'center',
          marginBottom: 0,
        }}>
        <Col style = {{ width: 16, backgroundColor: '#fafafa', borderTopRightRadius: 12, borderBottomRightRadius: 12 }}>
        </Col>
        <Col style = {{ width: (Constant.deviceWidth - fiveCardWidth) / 2 - 16, backgroundColor: '#fafafa' }}>
        </Col>
        <Col style={{ backgroundColor: 'white', borderRadius: 16 }}>
          <Row size={(category === 'book' ? fiveHeight - 140 : fiveHeight - 200)}
            style={{
            width: fiveCardWidth,
            height: (category === 'book' ? fiveHeight : fiveHeight - 60),
            borderRadius: 12,
            padding: 16,
            backgroundColor: 'transparent',
            }}>
            <Button transparent style={{
              flex: 1,
              height: (category === 'book' ? 240  : 200),
              width: 260,
              marginTop: 16,
              marginBottom: 16, 
              borderRadius: 8
              }} onPress={onPress}>
              <Image 
                source={{ uri: image_url }}
                style={{
                  height: (category === 'book' ? 240  : 240),
                  width: (category === 'book' ? 200  : 260),
                  borderRadius: 8,
                  resizeMode: 'contain',
              }}/>
            </Button>
          </Row>
          <Row size={50} style={{ justifyContent: 'center', backgroundColor: 'transparent', marginRight: 20, marginLeft: 20 }}>
            <Text large numberOfLines={1}>{title}</Text>
          </Row>
          <Row size={30} style={{ justifyContent: 'center', marginRight: 30, marginLeft: 30 }}>
            <Text note numberOfLines={1}>{subtitle}</Text>
          </Row>
          <Row size={40} style={{ justifyContent: 'center', alignItems: 'flex-start' }}>
            <Text micro yellow>{friends_info}</Text>
          </Row>
        </Col>
        <Col style = {{ width: (Constant.deviceWidth - fiveCardWidth) / 2 - 16, backgroundColor: '#fafafa' }}>
        </Col>          
        <Col style = {{ width: 16, backgroundColor: '#fafafa', borderTopLeftRadius: 12, borderBottomLeftRadius: 12 }}>
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
