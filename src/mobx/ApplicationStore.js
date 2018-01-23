import { observable } from 'mobx';
import { AsyncStorage } from 'react-native';

class ObservableApplicationStore {
  @observable email = '';
  @observable token = '';
  @observable key = '';
  @observable login = false;
  @observable first = true;
  @observable my_profile = '';

  async setFirstAuth() {
    await AsyncStorage.multiGet([ 'email', 'token', 'key' ], (err, stores) => {
      this.email = stores[0][1];
      this.token = stores[1][1];
      this.key = stores[2][1];
      this.login = false;
    });
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
      this.login = false
    );
  }
  async setMyProfile(user) {
    await (
      this.my_profile = user
    )
  }
}

const observableApplicationStore = new ObservableApplicationStore();
export default observableApplicationStore;
