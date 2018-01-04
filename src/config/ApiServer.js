export const DOMAIN = '192.168.1.71:3000';
export const API = 'http://' + DOMAIN;
//export const DOMAIN = "astrocket.com";
//export const API = "https://" + DOMAIN;

export const WEB_SOCKET = 'ws://' + DOMAIN;
export const CABLE = WEB_SOCKET + '/cable';
export const FB_SIGN_UP = API + '/users/facebook_callbacks/facebook';
export const HOME_INDEX = API + '/';

export const USERS = API + '/users';
export const MY_PROFILE = API + '/profiles';
export const RESTAURANTS = API + '/restaurants';
export const FOLLOWINGS = API + '/followings';
export const NOTIFICATIONS = API + '/notifications';
