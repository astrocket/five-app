import { Toast } from "native-base";
import * as Constant from '../config/Constant';

class StoreBase {

  defaultErrorHandler(e) {
    let msg = Constant.stringifyServerError(e);
    return Toast.show({
      text: msg,
      position: 'top',
      duration: 1500
    });
  }

  toastHandler(msg) {
    return Toast.show({
      text: msg,
      position: 'top',
      duration: 1500
    });
  }
}

export default StoreBase;
