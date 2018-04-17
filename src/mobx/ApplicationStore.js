import { observable } from 'mobx';
import { AsyncStorage } from 'react-native';
import axios from 'axios';
import * as ApiServer from '../config/ApiServer';

class ObservableApplicationStore {
  @observable email = '';
  @observable token = '';
  @observable key = '';
  @observable login = false;
  @observable first = true;
  @observable my_profile = '';
  @observable categories = [];
  @observable music_fives = [];
  @observable book_fives = [];
  @observable restaurant_fives = [];

  async setFirstAuth() {
    await AsyncStorage.multiGet([ 'email', 'token', 'key' ], (err, stores) => {
      this.email = stores[0][1];
      this.token = stores[1][1];
      this.key = stores[2][1];
      this.login = false;
    });
  }

  async signIn() {
    await (
      this.login = true
    )
  }

  async setAuthInfo() {
    await AsyncStorage.multiGet([ 'email', 'token', 'key' ], (err, stores) => {
      this.email = stores[0][1];
      this.token = stores[1][1];
      this.key = stores[2][1];
      this.login = true;
    });
  }

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

  async setMyProfile(user) {
    await (
      this.my_profile = user
    )
  }

  async updateCategories() {
    const header = {
      headers: {
        'X-User-Email': this.email,
        'X-User-Token': this.token,
      },
    };
    axios.get(`${ApiServer.MY_PROFILE}/categories`, header)
      .then(async (response) => {
        await (
          this.categories = response.data.categories
        )
      }).catch((error) => {
      console.log('에러 : ' + error.response);
    });
  }

  async hasCategory(target) {
    let have = false;
    await this.categories.forEach((chunk) => {
      console.log(`${chunk.category} == ${target}`);
      if (chunk.category === target) {
        have = true;
      }
    });
    return have;
  }

  matchFive(category) {
    switch (category) {
      case 'music':
        return this.music_fives;
      case 'book':
        return this.book_fives;
      case 'restaurant':
        return this.restaurant_fives;
      default:
        return [];
    }
  }

  async setFivesOf(category, fives) {
    console.log('setfivesof' + category + fives);
    switch (category) {
      case 'music':
        await (this.music_fives = fives);
        return true;
      case 'book':
        await (this.book_fives = fives);
        return true;
      case 'restaurant':
        await (this.restaurant_fives = fives);
        return true;
      default:
        return false;
    }
  }

  async getFivesOf(category) {
    switch (category) {
      case 'music':
        return this.music_fives;
      case 'book':
        return this.book_fives;
      case 'restaurant':
        return this.restaurant_fives;
      default:
        return [];
    }
  }

  async addFiveTo(category, five) {
    this.getFivesOf(category).then((fives) => {
      switch (category) {
        case 'music':
          this.music_fives.push(five);
          return true;
        case 'book':
          this.book_fives.push(five);
          return true;
        case 'restaurant':
          this.restaurant_fives.push(five);
          return true;
        default:
          return false;
      }
    });
  }

  async removeFiveTo(category, five) {
    this.getFivesOf(category).then((fives) => {
      var filteredFives = fives.filter(fv => fv.id !== five.id);
      switch (category) {
        case 'music':
          this.music_fives.replace(filteredFives);
          return true;
        case 'book':
          this.book_fives.replace(filteredFives);
          return true;
        case 'restaurant':
          this.restaurant_fives.replace(filteredFives);
          return true;
        default:
          return false;
      }
    });
  }

}

const observableApplicationStore = new ObservableApplicationStore();
export default observableApplicationStore;
