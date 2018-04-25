import {
  Dimensions
} from 'react-native';
import variable from '../../native-base-theme/variables/platform';
import * as ApiServer from './ApiServer';
export const platform = variable.platform;
export const FiveColor = '#FA3F97';
export const GreyColor = '#A1A1A1';
export const LightGrey = '#E1E1E1';

export const isIphoneX = platform === 'ios' && deviceHeight === 812 && deviceWidth === 375;
export const FiveNavOptions = {
  headerStyle: {
    backgroundColor: 'white',
    borderBottomWidth: 0,
    elevation:0
  },
  headerTintColor: '#FA3F97',
  headerBackTitleStyle: {
    color: '#FA3F97',
  },
  headerTitleStyle: {
    color: 'black',
  },
  drawerLockMode: 'locked-closed',
};

export const deviceWidth = Dimensions.get('window').width;
export const deviceHeight = Dimensions.get('window').height;

export const globalPaddingTop = platform === "ios" ? (variable.isIphoneX ? 39 : 20) : 0;

export const KakaoApiCategory = (category) => {
  let category_code;
  switch (category) {
    case 'restaurant':
      category_code = 'FD6,CE7';
      break;
    default:
      category_code = '';
      break;
  }
  return category_code
};

export const CategoryToKorean = (category) => {
  let korean_category;
  switch (category) {
    case 'restaurant':
      korean_category = '맛집';
      break;
    case 'music':
      korean_category = '음악';
      break;
    case 'book':
      korean_category = '책';
      break;
    default:
      korean_category = '';
      break;
  }
  return korean_category
};

export const CategoryToApi = (category) => {
  let api_suffix;
  switch (category) {
    case 'restaurant':
      api_suffix = ApiServer.RESTAURANTS;
      break;
    case 'music':
      api_suffix = ApiServer.MUSICS;
      break;
    case 'book':
      api_suffix = ApiServer.BOOKS;
      break;
    default:
      api_suffix = ApiServer.API;
      break;
  }
  return api_suffix
};

export const FiveShowButtonRight = (category, five) => {
  let button_right;
  switch (category) {
    case 'restaurant':
      button_right = {
        url: five.related_link || '',
        title: five.title || 'n/a',
        text: '보기',
        icon: 'utensils'
      };
      break;
    case 'music':
      button_right = {
        url: five.youtube_link || '',
        title: five.title || 'n/a',
        text: 'Play',
        icon: 'play'
      };
      break;
    case 'book':
      button_right = {
        url: five.purchase_link,
        title: five.title,
        text: 'Read',
        icon: 'book'
      };
      break;
    default:
      button_right = {
        url: '',
        title: 'n/a',
        text: 'n/a',
        icon: 'n/a'
      };
      break;
  }
  return button_right
};

export const askToParticipate = (category, user) => {
  return `${category} 파이브를 시작하고 ${user}님을 팔로우 하시겠어요?`
};

export const stringifyServerError = (e) => {
  let string_msg;
  let msg = (typeof e.response.data.errors === 'undefined') ? e.response.data : e.response.data.errors;
  if (Object.keys(msg).length > 1) {
    console.log('1');
    console.log(JSON.stringify(msg));
    msg = Object.keys(msg).map((k) => `${msg[k][0]}`).join('\n');
  } else {
    console.log('2');
    console.log(JSON.stringify(msg));
    msg = JSON.stringify(msg[0])
  }
  string_msg = msg.replace(/"/g,"");
  return string_msg;
};