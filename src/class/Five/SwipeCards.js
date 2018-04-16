'use strict';

import React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';

import SwipeCards from 'react-native-swipe-cards';

class Card extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.card}>
        <Image style={styles.thumbnail} source={{uri: this.props.image}} />
        <Text numberOfLines={1} style={styles.textTitle}>{this.props.name}</Text>
        <Text style={styles.textSmall}>{this.props.small}</Text>
        <Text style={styles.textFives}>FIVE {this.props.fives}</Text>
      </View>
    )
  }
}

class NoMoreCards extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.noMoreCards}>
        <Text>No more cards</Text>
      </View>
    )
  }
}

const cards = [
  {name: '사랑이 떠나가네', small: '김건모', fives: '21', image: 'https://media.giphy.com/media/GfXFVHUzjlbOg/giphy.gif'},
  {name: '본능적으로 한글긴이름여기까지', small: '윤종신 feat. Swings', fives: '7', image: 'https://media.giphy.com/media/irTuv1L1T34TC/giphy.gif'},
  {name: 'Moves Like A Jagger (longer than this)', small: 'Maroon 5', fives: '45', image: 'https://media.giphy.com/media/LkLL0HJerdXMI/giphy.gif'},
  {name: '첫인상', small: '박정현', fives: '1', image: 'https://media.giphy.com/media/fFBmUMzFL5zRS/giphy.gif'},
  {name: 'Best Mistake', small: 'Ariana Grande feat. Big Sean', fives: '192', image: 'https://media.giphy.com/media/oDLDbBgf0dkis/giphy.gif'},
]

const cards2 = [
  {name: 'for explanation', small: 'artist name', fives: '999', image: 'https://media.giphy.com/media/12b3E4U9aSndxC/giphy.gif'},
]

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: cards,
      outOfCards: false
    }
  }

  handleYup (card) {
    console.log("yup")
  }

  handleNope (card) {
    console.log("nope")
  }

  cardRemoved (index) {
    console.log(`The index is ${index}`);

    let CARD_REFRESH_LIMIT = 5

    if (this.state.cards.length - index <= CARD_REFRESH_LIMIT + 1) {
      console.log(`There are only ${this.state.cards.length - index - 1} cards left.`);

      if (!this.state.outOfCards) {
        console.log(`Adding ${cards2.length} more cards`)

        this.setState({
          cards: this.state.cards.concat(cards2),
          outOfCards: true
        })
      }

    }

  }

  render() {
    return (
      <SwipeCards
        cards={this.state.cards}
        loop={true}

        renderCard={(cardData) => <Card {...cardData} />}
        renderNoMoreCards={() => <NoMoreCards />}
        dragY={true}
        stack={true}
        stackOffsetX={0}
        stackOffsetY={16}
        showYup={false}
        showNope={false}

        handleYup={this.handleYup}
        handleNope={this.handleNope}
        cardRemoved={this.cardRemoved.bind(this)}
      />
    )
  }
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    width: 256,
    height: 380,
    overflow: 'hidden',
    backgroundColor: 'white',
    borderColor: '#7ED321',
    borderRadius: 16,
    borderWidth: 1  ,
  },
  thumbnail: {
    width: 240,
    height: 240,
    marginTop: 16,
  },
  textTitle: {
    fontSize: 24,
    fontWeight: '900',
    paddingTop: 10,
    paddingBottom: 10,
    marginRight: 10,
    marginLeft: 10,
  },
    textSmall: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#A1A1A1',
    paddingTop: 0,
    paddingBottom: 10,
  },
    textFives: {
    fontSize: 12,
    fontWeight: 'normal',
    color: '#F7CB01',
    paddingTop: 5,
    paddingBottom: 5,
  },
  noMoreCards: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})

export { SwipeCards };
