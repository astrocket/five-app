import { observable, action, autorun } from 'mobx';
import axios from 'axios';
import * as ApiServer from '../config/ApiServer';
import * as Constant from '../config/Constant';
import StoreBase from './StoreBase';

class AuthStore extends StoreBase {
  constructor(app) {
    super();
    this.app = app;
  }

  async phoneSendSms(phone, cb, eb = (e) => this.defaultErrorHandler(e)) {
    await axios.post(`${ApiServer.PHONE}/send_sms`, {phone_number: phone})
      .then(cb).catch(eb);
  }

  async phoneVerify(phone, pin, cb, eb = (e) => this.defaultErrorHandler(e)) {
    await axios.post(`${ApiServer.PHONE}/verify`, {pin_phone: phone, pin_number: pin})
      .then(cb).catch(eb);
  }

  async userSignIn(email, password, cb, eb = (e) => this.defaultErrorHandler(e)) {
    await axios.post(`${ApiServer.USERS}/sign_in`, {user: {email: email, password: password }})
      .then(cb).catch(eb);
  }

  async userCreate(data, cb, eb = (e) => this.defaultErrorHandler(e) ) {
    await axios.post(`${ApiServer.USERS}`, data)
      .then(cb).catch(eb)
  }

}

export default AuthStore;