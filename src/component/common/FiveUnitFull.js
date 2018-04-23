import React from 'react';
import {
  Image,
  TouchableOpacity,
  View, Dimensions,
} from 'react-native';
import {
  Card,
  CardItem,
  Text,
  Thumbnail, Button, Icon,
} from 'native-base';
import * as Constant from '../../config/Constant';
import BaseStyle from '../../config/BaseStyle';

const FiveUnitFull = ({ id, category, subtitle, title, image_url, friends_info, onPress, multiple, borderRadius, marginRight, cardCut }) => {
  const { container } = BaseStyle;
  const deviceWidth = Dimensions.get('window').width;

  if (multiple) {
    return (
      <View>
        <View style={{
          width: null,
          height: 380,
          marginBottom: 12,
          borderRadius: borderRadius,
          marginRight: marginRight,
          marginTop: 6,
        }}>
          <TouchableOpacity transparent style={{
            width: null,
            height: null,
            borderRadius: borderRadius,
            marginBottom: 5,
          }} onPress={onPress}>
            <Image
              source={{ uri: image_url }}
              style={{
                width: (category === 'book' ? 170  : 240),
                resizeMode: 'cover',
                height: 240,
                borderRadius: borderRadius,
              }}
            />
          </TouchableOpacity>
          <View>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              marginTop: 12,
            }}>
              <Text large numberOfLines={1} style = {{ padding: 4, width: 190 }}>{title}</Text>
            </View>
            <Text note numberOfLines={1} style = {{ paddingLeft: 4, width: 190 }}>{subtitle}</Text>
            <Text micro yellow style = {{ padding: 6 }}>{friends_info}</Text>
          </View>
        </View>
      </View>
    );
{/*      <View>
        <View style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'flex-start',
          height: null,
          width: 270,
          marginRight: marginRight,
          borderRadius: borderRadius,
          marginBottom: 10,
        }}>
          <TouchableOpacity transparent style={{
            justifyContent: 'flex-start',
            height: null,
            width: null,
            borderRadius: borderRadius,
            marginBottom: 5,
            backgroundColor: '#A22'
          }} onPress={onPress}>
            <Image source={{ uri: image_url }} style={{
              height: 240,
              width: null,
              borderRadius: borderRadius,
              marginBottom: 10,
              resizeMode: 'contain',
              flex: 1,
              alignItems: 'flex-start',
              justifyContent: 'flex-start'
            }}/>
          </TouchableOpacity>
          <View>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
            }}>
              <Text large numberOfLines={1} style = {{ paddingLeft: 3, width: 200 }}>{title}</Text>
            </View>
            <Text note numberOfLines={1} style = {{ padding: 6, paddingLeft: 3, width: 200 }}>{subtitle}</Text>
            <Text micro yellow style = {{ padding: 3 }}>{friends_info}</Text>
          </View>
        </View>
      </View>
    );*/}
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

export { FiveUnitFull };
