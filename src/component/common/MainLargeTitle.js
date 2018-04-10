import React from 'react';
import {
  Image,
} from 'react-native'
import {
  Text,
} from 'native-base';
import { Row } from 'react-native-easy-grid';
import * as Images from '../../assets/images/Images';
import * as Constant from '../../config/Constant';
import BaseStyle from '../../config/BaseStyle';

const MainLargeTitle = ({ title, rightImage }) => {
  const { container } = BaseStyle;
  if (rightImage) {
    return (
      <Row style={{
        marginBottom: 20,
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Text xlarge>{title}</Text>
        <Image
          source={Images.findImageOf(rightImage)}
          style={{
            height: (Constant.deviceWidth / 4) + 5,
            width: Constant.deviceWidth / 4,
            borderRadius: Constant.deviceWidth / 8
          }}
        />
      </Row>
    )
  } else {
    return (
      <Row style={{
        marginBottom: 20,
        paddingLeft: 10,
        paddingRight: 10,
      }}>
        <Text xlarge>{title}</Text>
      </Row>
    )
  }
};

export { MainLargeTitle };
