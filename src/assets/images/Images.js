export const restaurant_main = require('./restaurant_main.png');
export const music_main = require('./music_main.png');
export const book_main = require('./book_main.png');
export const default_main = require('./five_void_grey.png');

export const findImageOf = (name) => {
  let image;
  switch (name) {
    case 'restaurant':
      image = require('./restaurant_main.png');
      break;
    case 'music':
      image = require('./music_main.png');
      break;
    case 'book':
      image = require('./book_main.png');
      break;
    default:
      image = require('./restaurant_main.png');
      break;
  }

  return image;
};
