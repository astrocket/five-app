import { observable } from 'mobx';
import { AsyncStorage } from 'react-native';

class ObservableApplicationStore {
  @observable email = '';
  @observable token = '';
  @observable key = '';

  async setAuthInfo() {
    await AsyncStorage.multiGet([ 'email', 'token', 'key' ], (err, stores) => {
      this.email = stores[ 0 ][ 1 ];
      this.token = stores[ 1 ][ 1 ];
      this.key = stores[ 2 ][ 1 ];
    });
  }
}

const observableApplicationStore = new ObservableApplicationStore();
export default observableApplicationStore;
