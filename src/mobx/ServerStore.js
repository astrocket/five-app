import { observable, action, autorun } from 'mobx';
import { AsyncStorage } from 'react-native';
import axios from 'axios';
import * as ApiServer from '../config/ApiServer';
import * as Constant from '../config/Constant';
import StoreBase from './StoreBase';

class ServerStore extends StoreBase {

  constructor(app) {
    super();
    this.app = app;
    autorun(() => {
      this.header = {
        headers: { 'X-User-Email': app.email, 'X-User-Token': app.token },
      };
      this.formHeader = {
        headers: { 'X-User-Email': app.email, 'X-User-Token': app.token, 'Content-Type': 'multipart/form-data;' },
      };
      this.categories = app.categories;
    });
  }

  @action
  doNothing() {}

  /* index calls */

  async homeIndex(setState, eb = (e) => this.defaultErrorHandler(e)) {
    await axios.get(`${ApiServer.HOME_INDEX}`, this.header)
      .then((res) => {
        setState({ home_categories: res.data.home_categories });
      }).catch(eb);
  }

  async fiveIndex(category, setState, eb = (e) => this.defaultErrorHandler(e)) {
    await axios.get(Constant.CategoryToApi(category), this.header)
      .then((res) => {
        setState({ fives: res.data.fives, my_wish_fives: res.data.my_wish_fives, follow_suggestions: res.data.follow_suggestions, challenge_fives: res.data.challenge_fives });
      }).catch(eb);
  }


  async followPost(user_id, current_following, category, cb, eb = (e) => this.defaultErrorHandler(e)) {
    const data = { following: { user_id: user_id, following: !current_following}};
    await axios.post(`${ApiServer.FOLLOWINGS}/?category=${category}`, data, this.header)
      .then(cb).catch(eb);
  }

  /* search user */
  async searchUser(state, setState, eb = (e) => this.defaultErrorHandler(e)) {
    await axios.get(`${ApiServer.USERS}/search_user?s=${state.input_search}&page=${state.page}`, this.header)
      .then((res) => {
        if (res.data.users.length > 0) {
          setState({ no_result: false, searched: true, users: res.data.users, no_more: res.data.no_more})
        } else {
          setState({ no_result: true, searched: true, users: res.data.users, no_more: res.data.no_more})
        }
      }).catch(eb);
  }

  async searchUserPaging(state, setState, eb = (e) => this.defaultErrorHandler(e)) {
    await axios.get(`${ApiServer.USERS}/search_user?s=${state.input_search}&page=${state.page}`, this.header)
      .then((res) => {
        setState({ no_result: false, searched: true, users: [ ...state.users, ...res.data.users], no_more: res.data.no_more})
      }).catch(eb);
  }

  async userSuggestions(setState, eb = (e) => this.defaultErrorHandler(e)) {
    await axios.get(`${ApiServer.USERS}/suggestions`, this.header)
      .then((res) => {
        setState({ suggestions: res.data, loading: false })
      }).catch(eb);
  }

  async userSignOut() {
    await axios.post(`${ApiServer.USERS}/sign_out`, this.header)
      .then((res) => {
        AsyncStorage.multiRemove([ 'email', 'token', 'key', 'login', 'first', 'my_profile', 'categories', 'contact_agreed' ])
          .then(async () => {
            await this.app.signOut();
          });
      })
  }

  async userShow(id, cb, eb = (e) => this.defaultErrorHandler(e)) {
    await axios.get(`${ApiServer.USERS}/${id}`, this.header)
      .then(cb).catch(eb);
  }

  async userFives(id, category, cb, eb = (e) => this.defaultErrorHandler(e)) {
    await axios.get(`${ApiServer.USERS}/${id}/fives?category=${category}`, this.header)
      .then(cb).catch(eb);
  }

  async userList(page, search_params, cb, eb = (e) => this.defaultErrorHandler(e)) {
    await axios.get(`${ApiServer.USERS}/list?page=${page}&s=${search_params}`, this.header)
      .then(cb).catch(eb);
  }

  async userFollowees(id, category, page, cb, eb = (e) => this.defaultErrorHandler(e)) {
    await axios.get(`${ApiServer.USERS}/${id}/followees?category=${category}&page=${page}`, this.header)
      .then(cb).catch(eb);
  }

  async userFollowers(id, category, page, cb, eb = (e) => this.defaultErrorHandler(e)) {
    await axios.get(`${ApiServer.USERS}/${id}/followers?category=${category}&page=${page}`, this.header)
      .then(cb).catch(eb);
  }

  /* device calls */
  async deviceContactPost(contacts, setState, eb = (e) => this.defaultErrorHandler(e)) {
    axios.post(`${ApiServer.MY_PROFILE}/device_contacts`, {contacts: contacts}, this.header)
      .then((res) => {
        setState({ contact_friends: res.data })
      }).catch(eb);
  }

  /* notifications */
  async notificationIndex(state, setState, eb = (e) => this.defaultErrorHandler(e)) {
    await axios.get(`${ApiServer.NOTIFICATIONS}?page=${state.page}`, this.header)
      .then((res) => {
        setState({ notifications: res.data.notifications, no_more: res.data.no_more });
      }).catch(eb);
  }

  async notificationIndexPaging(state, setState, eb = (e) => this.defaultErrorHandler(e)) {
    await axios.get(`${ApiServer.NOTIFICATIONS}?page=${state.page}`, this.header)
      .then((res) => {
        if (res.data.no_more) {
          setState({ no_more: true });
        } else {
          setState({ notifications: [ ...state.notifications, ...res.data.notifications ], no_more: res.data.no_more, });
        }
      }).catch(eb);
  }

  /* profile calls */
  async profileIndex(cb, eb = (e) => this.defaultErrorHandler(e)) {
    await axios.get(`${ApiServer.MY_PROFILE}`, this.header)
      .then(cb).catch(eb);
  }

  async profileMe(setState, eb = (e) => this.defaultErrorHandler(e)) {
    await axios.get(`${ApiServer.MY_PROFILE}/me`, this.header)
      .then(async (res) => {
        await this.app.setMyProfile(res.data);
      }).catch(eb);
  }

  async profileUpdate(data, setState, headerType = null, cb = async (res) => await this.app.setMyProfile(res.data), eb = (e) => this.defaultErrorHandler(e)) {
    const headerOption = headerType === 'form' ? this.formHeader : this.header;
    await axios.post(`${ApiServer.MY_PROFILE}/update_user`, data, headerOption)
      .then(cb).catch(eb);
  }

  async profileDestroyCategory(category, eb = (e) => this.defaultErrorHandler(e)) {
    await axios.post(`${ApiServer.MY_PROFILE}/destroy_category`, { category: category, }, this.header)
      .then(async (res) => {
        await this.app.setMyProfile(res.data)
      }).catch(eb);
  }

  async profileWishes(setState, eb = (e) => this.defaultErrorHandler(e)) {
    await axios.get(`${ApiServer.MY_PROFILE}/wishes`, this.header)
      .then((res) => {
        setState({ categories: res.data.categories })
      }).catch(eb);
  }

  async profileCategoryWish(setState, category, cb, eb = (e) => this.defaultErrorHandler(e)) {
    await axios.get(`${ApiServer.MY_PROFILE}/wishes?category=${category}`, this.header)
      .then(cb).catch(eb);
  }

  async profileCategoryFive(category, cb, eb = (e) => this.defaultErrorHandler(e)) {
    await axios.get(`${ApiServer.MY_PROFILE}/fives?category=${category}`, this.header)
      .then(cb).catch(eb);
  }


  async profileFollowees(category, page, cb, eb = (e) => this.defaultErrorHandler(e)) {
    await axios.get(`${ApiServer.MY_PROFILE}/followees?category=${category}&page=${page}`, this.header)
      .then(cb).catch(eb);
  }

  async profileFollowers(category, page, cb, eb = (e) => this.defaultErrorHandler(e)) {
    await axios.get(`${ApiServer.MY_PROFILE}/followers?category=${category}&page=${page}`, this.header)
      .then(cb).catch(eb);
  }

  async homeNotice(page, cb, eb = (e) => this.defaultErrorHandler(e)) {
    await axios.get(`${ApiServer.HOME}/notice`, this.header)
      .then(cb).catch(eb)
  }

  /* general Functions */


}

export default ServerStore;
