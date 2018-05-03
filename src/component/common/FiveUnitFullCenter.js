import React from 'react';
import {
  Image,
  TouchableHighlight,
  TouchableOpacity,
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
        <View style={{ 
          backgroundColor: 'white', 
          borderRadius: 16,
          height: fiveHeight,
          width: fiveCardWidth,
          }}>
            <TouchableOpacity style={{ 
              backgroundColor: 'transparent',
              flex: 1,
              height: (category === 'book' ? 240  : 200),
              width: 260,
              margin: 16,
              borderRadius: 0
              }} onPress={onPress}>
              <Image 
                source={{ uri: image_url }}
                style={{
                  height: (category === 'book' ? 240  : 240),
                  width: (category === 'book' ? 200  : 260),
                  borderRadius: 4,
                  resizeMode: 'contain',
              }}/>
            </TouchableOpacity>

          <View style = {{ alignItems: 'center', justifyContent: 'center' }}>
            <Text large numberOfLines={1} style = {{
              paddingTop: 8, paddingBottom: 8, paddingLeft: 32, paddingRight: 32,
              }}
              >{title}</Text>
            <Text note numberOfLines={1} style = {{
              paddingTop: 4, paddingBottom: 4, paddingLeft: 40, paddingRight: 40,
              }}>{subtitle}</Text>
            <Text micro yellow style = {{
              padding: 8,
              marginBottom: 16
              }}>{friends_info}</Text>
          </View>
        </View>
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
