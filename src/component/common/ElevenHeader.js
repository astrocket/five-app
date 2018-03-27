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
    paddingLeft: 10, paddingRight: 10,
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
          <Text xlarge>{title}</Text>
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
                      fontSize: 25,
                      color: Constant.FiveColor,
                    }}
                  />
                }

              </Button>
            </View> : null
          }
        </View> : <Header>{props.children}</Header>
    );
  } else {
    return (
      headerShow ?
        <View style={bigHeader}>
          <Text xlarge>{title}</Text>
        </View> :
        <Header>
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
