import React from 'react';
import {
  StyleSheet, TouchableOpacity, View,
} from 'react-native';
import {
  Text,
} from 'native-base';
import { Row } from 'react-native-easy-grid';
import BaseStyle from '../../config/BaseStyle';
import * as Constant from '../../config/Constant';

const RowHeaderBar = ({ title, sub, yellowLabel, onPress, moreTitle, style }) => {
  const { container } = BaseStyle;
  if (onPress) {
    return (
      <View>
        <View style={[style, {
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingRight: 20,
          paddingLeft: 16,
          paddingTop: 24,
          marginRight: 3,
        }]}>
          <View style={[style, { flex: 1, flexDirection: 'row'}]}>
            <Text style={styles.rowHeaderBarTitle}>{title}</Text>
            {yellowLabel ?
              <Text small yellow>{yellowLabel}</Text>
              :null}
          </View>
          <TouchableOpacity onPress={onPress} underlayColor={'#fff'}>
            <Text primary>{moreTitle}</Text>
          </TouchableOpacity>
        </View>
        <View style={[style, { flex: 1, flexDirection: 'row'}]}>
          <Text style={styles.rowHeaderBarSub}>{sub}</Text>
        </View>
      </View>
    )
  } else {
    return (
      <View>
        <View style={[style, {
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingRight: 16,
          paddingLeft: 16,
          paddingTop: 24,
          marginRight: 3,
        }]}>
          <View style={[style, { flex: 1, flexDirection: 'row'}]}>
            <Text style={styles.rowHeaderBarTitle}>{title}</Text>
          </View>
        </View>
        <View style={[style, { flex: 1, flexDirection: 'row'}]}>
          <Text style={styles.rowHeaderBarSub}>{sub}</Text>
        </View>
      </View>
    )
  }
};

const styles = StyleSheet.create({
  rowHeaderBarTitle: {
    fontSize: 20  ,
    color: '#333333',
    fontWeight: 'bold',
    marginLeft: 3,
  },
  rowHeaderBarSub: {
    paddingLeft: 16,
    paddingTop: 8,
    paddingBottom: 16, 
    fontSize: 14,
    color: Constant.GreyColor,
    fontWeight: '300',
    marginLeft: 3,
  },
});

export { RowHeaderBar };
