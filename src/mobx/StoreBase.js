import { Toast } from "native-base";

class StoreBase {

  defaultErrorHandler(e) {
    const msg = (typeof e.response.data.errors === 'undefined') ? e.response.data : e.response.data.errors;
    return Toast.show({
      text: JSON.stringify(msg),
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