import React from 'react';
import {
  View, Image
} from 'react-native';
import {
  Text, Header, Left, Body, Right, Title, Button, Icon,
} from 'native-base';
import { ImageCon } from './';
import * as Constant from '../../config/Constant';
import BaseStyle from '../../config/BaseStyle';

const ElevenHeader = (props) => {
  const { container } = BaseStyle;
  const { headerShow, title, custom, rightButton, onPressRight, buttonIcon, rightAsImage } = props;
  const bigHeader = {
    paddingBottom: 10, paddingTop: Constant.globalPaddingTop + 35,
    paddingLeft: 16, paddingRight: 16,
    height: Constant.globalPaddingTop + 35 + 50,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  };

  if (custom) {
    return (
      headerShow ?
        <View style={bigHeader}>
          <Text xlarge montserrat>{title}</Text>
          {rightButton ?
            <View>
              <Button onPress={onPressRight} transparent>
                {rightAsImage ?
                  <ImageCon
                    image={buttonIcon}
                  />
                  :<Icon
                    name={buttonIcon}
                    style={{
                      fontSize: 28,
                      color: Constant.FiveColor,
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
                      color: Constant.FiveColor,
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
