import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Container, Header, View, DeckSwiper, Icon, // DeckSwiper 위해 추가로 임포트한 부분
  Card,
  CardItem,
  Text,
  Thumbnail,
  ListItem,
  Left,
  Body,
  Right,
  Badge
} from 'native-base';
import { FollowSmallButton } from '../../component/common';
import * as Images from '../../assets/images/Images';
import * as Constant from '../../config/Constant';
import BaseStyle from '../../config/BaseStyle';

const FiveDecks = ({ text, name, five, image, width, pureWidth}) => {
  return (
    <Container>
      <Header />
      <View>
        <DeckSwiper
          dataSource={cards}
          renderItem={item =>
            <Card style={{ elevation: 3 }}>
              <CardItem>
                <Left>
                  <Thumbnail source={item.image} />
                  <Body>
                    <Text>{item.text}</Text>
                    <Text note>NativeBase</Text>
                  </Body>
                </Left>
              </CardItem>
              <CardItem cardBody>
                <Image style={{ height: 300, flex: 1 }} source={item.image} />
              </CardItem>
              <CardItem>
                <Icon name="heart" style={{ color: '#ED4A6A' }} />
                <Text>{item.name}</Text>
              </CardItem>
            </Card>
          }
        />
      </View>
    </Container>
  ); 
}
  {
    text: 'Card One',
    name: 'One',
    image: require('../../assets/images/five_icon_grey.png'),
  },
  .  .  .
];

const UnitImage = ({ five, image, width, height }) => {
  if (five) {
    return (
      <Image key={1} source={{ uri: five.image_medium_url }} style={{height: height - 2, width: width - 2, marginRight: 1, marginBottom: 1, borderRadius: 10 }}/>
    )
  } else {
    return (
      <Image key={2} source={image} style={{height: height - 2, width: width - 2, marginRight: 1, marginBottom: 1,  borderRadius: 10}}/>
    )
  }
};

const FiveImages = ({ fives, image, pureWidth }) => {
  return(
    <View style={{ flexDirection: 'row', flex: 1, height: pureWidth / 2, width: pureWidth}}>
      <View style={{ flex: 1, marginRight: 0 }}>
        <UnitImage five={fives[0]} image={image} height={pureWidth / 2} width={pureWidth / 2} />
      </View>
      <View style={{ flex: 1, flexWrap: 'wrap' }}>
        <UnitImage five={fives[1]} image={image} height={pureWidth / 4} width={pureWidth / 4} />
        <UnitImage five={fives[2]} image={image} height={pureWidth / 4} width={pureWidth / 4} />
        <UnitImage five={fives[3]} image={image} height={pureWidth / 4} width={pureWidth / 4} />
        <UnitImage five={fives[4]} image={image} height={pureWidth / 4} width={pureWidth / 4} />
      </View>
    </View>
  )
};

const FivesBar = ({ image, fiveImage, onPress, category, followers, followees, fives, followButton, onPressFollow, clicked }) => {
  const { container } = BaseStyle;
  let cardPadding = 5;
  let cardMargin = 16;
  let pureWidth = Constant.deviceWidth - cardMargin * 2 - cardPadding * 2;

  return (
    <View style={{ width: pureWidth + cardPadding * 2, margin: cardMargin, padding: cardPadding}}>
      <TouchableOpacity onPress={onPress}>
        <FiveImages fives={fives} image={image} pureWidth={pureWidth} />
      </TouchableOpacity>
      <ListItem cardStyle transparent button>
        <Thumbnail size={50} source={fiveImage}/>
        <Body>
          <Text medium>{Constant.CategoryToKorean(category)}</Text>
          <View style={{ flexDirection: 'row', padding: 2}}>
            <Text small style={{ marginRight: 0 }}>{Number(followers).toLocaleString()}</Text>
            <Text note>{'팔로워'}</Text>
            <Text small style={{ marginRight: 0 }}>{Number(followees).toLocaleString()}</Text>
            <Text note>{'팔로잉'}</Text>
          </View>
        </Body>
        {followButton ?
          <Right>
            <FollowSmallButton
              onPress={onPressFollow}
              textTrue={'팔로잉'}
              textFalse={'팔로우'}
              clicked={clicked}
            />
          </Right> : null}
      </ListItem>
    </View>
  );
};

export { FivesDeckSwiper };
