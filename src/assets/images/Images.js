export const restaurant_main = require('./restaurant_main.jpg');
export const music_main = require('./restaurant_main.jpg');
export const book_main = require('./restaurant_main.jpg');

export const findImageOf = (name) => {
  let image;
  switch (name) {
    case 'restaurant':
      image = require('./restaurant_main.jpg');
      break;
    case 'music':
      image = require('./restaurant_main.jpg');
      break;
    case 'book':
      image = require('./restaurant_main.jpg');
      break;
    default:
      image = require('./restaurant_main.jpg');
      break;
  }

  return image;
};