//export const DOMAIN = '172.20.10.2:3000';
export const DOMAIN = "110.10.189.185";
export const API = "http://" + DOMAIN;

export const WEB_SOCKET = 'ws://' + DOMAIN;
export const CABLE = WEB_SOCKET + '/cable';
export const FB_SIGN_UP = API + '/users/facebook_callbacks/facebook';
export const HOME_INDEX = API;

export const HOME = API + '/home';
export const USERS = API + '/users';
export const MY_PROFILE = API + '/profiles';
export const RESTAURANTS = API + '/restaurants';
export const MUSICS = API + '/musics';
export const BOOKS = API + '/books';
export const FOLLOWINGS = API + '/followings';
export const NOTIFICATIONS = API + '/notifications';
export const FIVE_STORY = API + '/five_stories';
export const PHONE = API + '/phone_numbers';
export const COMPANY = API + '/company';
export const CUSTOMER_INQUERY = API + '/customer_inqueries';

export const KAKAO_API = "https://dapi.kakao.com/v2/local/search/keyword.json";
export const KAKAO_GEO_API = "https://dapi.kakao.com/v2/local/geo/coord2address.json";
export const KAKAO_API_KEY = "KakaoAK bab8a90e14c4b2ec6eb2adda19e7b476";
