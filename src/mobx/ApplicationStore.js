import { action, observable, computed } from 'mobx';
import { AsyncStorage } from 'react-native';
import axios from 'axios';
import * as ApiServer from '../config/ApiServer';
import { NavigationActions } from 'react-navigation';
import StoreBase from './StoreBase';

class ApplicationStore extends StoreBase {
  @observable email = '';
  @observable token = '';
  @observable key = '';
  @observable login = false;
  @observable first = true;
  @observable my_profile = '';
  @observable category_names = [];
  @observable.shallow categories = [];

  @action
  async signIn() {
    await (
      this.login = true
    )
  }

  async onSignInSuccess(data) {
    await AsyncStorage.multiSet([
      [ 'email',  data.email],
      [ 'token', data.authentication_token ],
      [ 'key', data.key ]
    ]).then( async () => {
      await this.setAuthInfo();
    });
  }

  async onSignUpSuccess(data) {
    await AsyncStorage.multiSet([
      [ 'email',  data.email],
      [ 'token', data.authentication_token ],
      [ 'key', data.key ]
    ]).then( async () => {
      await this.setFirstAuth();
    });
  }

  @action
  async setAuthInfo() {
    await AsyncStorage.multiGet([ 'email', 'token', 'key' ], (err, stores) => {
      this.email = stores[0][1];
      this.token = stores[1][1];
      this.key = stores[2][1];
      this.login = true;
    });
  }

  @action
  async setFirstAuth() {
    await AsyncStorage.multiGet([ 'email', 'token', 'key' ], (err, stores) => {
      this.email = stores[0][1];
      this.token = stores[1][1];
      this.key = stores[2][1];
      this.login = false;
    });
  }

  @action
  async signOut() {
    await (
        this.email = '',
        this.token = '',
        this.key = '',
        this.login = false,
        this.first = true,
        this.my_profile = '',
        this.categories = []
    );
  }

  @action
  async setMyProfile(user) {
    await (
      this.my_profile = user
    )
  }

  @action
  async setCategories(categories) {
    await (
      this.categories = this.formattedCategories(categories),
      this.category_names = categories.map((category_chunk) => {return this.formattedCategoryName(category_chunk)})
    );
  }

  formattedCategoryName(category_chunk) {
    return {
      category: category_chunk.category,
      category_korean: category_chunk.category_korean,
      klass: category_chunk.klass
    };
  }

  formattedCategories(categories){
    let formatted = categories;
    formatted = categories.map((category_chunk, i) => {
      formatted[i] = this.formattedCategory(category_chunk);
      return formatted[i];
    }).slice();
    return formatted;
  }

  formattedCategory(category_chunk){
    let formatted = category_chunk;
    formatted.fives = category_chunk.fives.slice();
    return formatted;
  }

  async updateCategories() {
    const header = { headers: { 'X-User-Email': this.email, 'X-User-Token': this.token, }, };
    await axios.get(`${ApiServer.MY_PROFILE}/categories`, header)
      .then( async (res) => {
        await this.setCategories(res.data.categories)
      }).catch((e) => {this.defaultErrorHandler(e)});
  }

  async hasCategory(target_category) {
    let have = false;
    await this.category_names.forEach((category_chunk) => {
      if (category_chunk.category === target_category) {
        have = true;
      }
    });
    return have;
  }

  findCategory(target_category) {
    return computed(() => {
      let category = false;
      this.categories.forEach((category_chunk) => {
        if (category_chunk.category === target_category ) {
          category = category_chunk;
        }
      });
      return category;
    })
  }

  async findCategoryIndex(target_category) {
    let index = -1;
    await this.categories.forEach((category_chunk, i) => {
      if (category_chunk.category === target_category ) {
        index = i;
      }
    });
    return index;
  }

  @action
  async updateCategory(target_category, category_chunk) {
    const i = await this.findCategoryIndex(target_category);
    let newCategories = this.categories;
    newCategories[i] = category_chunk;
    await this.setCategories(newCategories);
  }

  @action
  async updateFives(target_category, fives) {
    const i = await this.findCategoryIndex(target_category);
    let newCategories = this.categories;
    newCategories[i].fives = fives;
    await this.setCategories(newCategories);
  }

  async removeFive(target_category, target_five_id) {
    const i = await this.findCategoryIndex(target_category);
    let newFives = this.categories[i].fives;
    newFives.forEach((five, index) => {
      if (five.id === target_five_id) {
        newFives.splice(index, 1);
      }
    });
    await this.updateFives(target_category, newFives);
  }

  async addFive(target_category, target_five) {
    let i;
    const have = await this.hasCategory(target_category);
    if (have) {
      i = await this.findCategoryIndex(target_category);
    } else {
      await this.updateCategories();
      i = await this.findCategoryIndex(target_category);
    }
    let newFives = this.categories[i].fives;
    if (newFives.length < 6) {
      newFives.push(target_five);
    }
    await this.updateFives(target_category, newFives);
  }

}

export default ApplicationStore;
