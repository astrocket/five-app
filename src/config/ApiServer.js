export const DOMAIN = '127.0.0.1:3000';
export const API = 'http://' + DOMAIN;
//export const DOMAIN = "five_api.insomenia.com";
//export const API = "http://" + DOMAIN;

export const WEB_SOCKET = 'ws://' + DOMAIN;
export const CABLE = WEB_SOCKET + '/cable';
export const FB_SIGN_UP = API + '/users/facebook_callbacks/facebook';
export const HOME_INDEX = API;

export const USERS = API + '/users';
export const MY_PROFILE = API + '/profiles';
export const RESTAURANTS = API + '/restaurants';
export const FOLLOWINGS = API + '/followings';
export const NOTIFICATIONS = API + '/notifications';
export const FIVE_STORY = API + '/five_stories';
export const PHONE = API + '/phone_numbers';
export const COMPANY = API + '/company';