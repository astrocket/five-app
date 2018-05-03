import React from 'react';
import {
  View, Image
} from 'react-native';
import {
  Text, Header, Left, Body, Right, Title, Button,
} from 'native-base';
import { ImageCon } from './';
import * as Constant from '../../config/Constant';
import BaseStyle from '../../config/BaseStyle';

import Icon from 'react-native-vector-icons/FontAwesome';

const ElevenHeader = (props) => {
  const { container } = BaseStyle;
  const { headerShow, title, custom, rightButton, onPressRight, buttonIcon, rightAsImage } = props;
  const bigHeader = {
    paddingBottom: 16, 
    paddingTop: Constant.globalPaddingTop + 16,
    paddingLeft: 16, 
    paddingRight: 16,
    height: Constant.globalPaddingTop + 56,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  };

  if (custom) {
    return (
      headerShow ?
        <View style={bigHeader}>
          <Text style = {{
            fontSize: 26,
            fontWeight: '900',
            color: '#333333',
          }}
            >{title}</Text>
          {rightButton ?
            <View style = {{ position: 'absolute', top: 16, right: 12 }}>
              <Button onPress={onPressRight} transparent>
                {rightAsImage ?
                  <Image
                    source={buttonIcon}
                    style={{
                      height: 28,
                      width: 66,
                      marginTop: 2,
                      resizeMode: 'contain',
                    }}
                  />
                  :<Icon
                    name={buttonIcon}
                    style={{
                      fontSize: 28,
                      color: Constant.LightGrey,
                      marginRight: 2,
                    }}
                  />
                }
              </Button>
            </View> : null
          }
        </View> :
          <Header style = {{ backgroundColor: 'white', borderBottomColor: 'white' }}>
            <Left/>
            <Body>
            <Title>{title}</Title>
            </Body>
            <Right>
              <Button onPress={onPressRight} transparent>
                {rightAsImage ?
                  <ImageCon
                    image={buttonIcon}
                  />
                  :<Icon
                    name={buttonIcon}
                    style={{
                      fontSize: 28,
                      color: Constant.LightGrey,
                    }}
                  />}
              </Button>
            </Right>
          </Header>
    );
  } else {
    return (
      headerShow ?
        <View style={bigHeader}>
          <Text xlarge montserrat>{title}</Text>
        </View> :
        <Header style = {{ backgroundColor: 'white' }}>
          <Left/>
          <Body>
          <Title>{title}</Title>
          </Body>
          <Right />
        </Header>
    );
  }

};

export { ElevenHeader };
