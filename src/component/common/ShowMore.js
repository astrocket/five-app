import React from 'react';
import {
  Image,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Button, Text, Spinner
} from 'native-base';
import BaseStyle from '../../config/BaseStyle';

const ShowMore = ({ overText, no_more, page_loading, moreText, onPress }) => {
  const { container } = BaseStyle;
  if (no_more) {
    return (
      <Button full primary disabled>
        <Text>{overText}</Text>
      </Button>
    );
  }

  if (page_loading) {
    return <Spinner primary size="small"/>;
  }

  return (
    <Button full primary onPress={onPress}>
      <Text>{moreText}</Text>
    </Button>
  );
};

export { ShowMore };
