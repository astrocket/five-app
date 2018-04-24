import { Toast } from "native-base";

class StoreBase {

  defaultErrorHandler(e) {
    let msg = (typeof e.response.data.errors === 'undefined') ? e.response.data : e.response.data.errors;
    if (Object.keys(msg).length > 1) {
      msg = Object.keys(msg).map((k) => `[${msg[k]}]`);
    } else {
      msg = JSON.stringify(msg)
    }
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