/**
 * Astro Boiler App
 * https://github.com/astrocket
 * init, 2017.11.21
 */
import React, {
  Component,
} from 'react';
import {
  Root,
} from 'native-base';
import Astro from './Astro';
import { Provider, observer } from 'mobx-react/native';
import ServerStore from './src/mobx/ServerStore';
import ApplicationStore from './src/mobx/ApplicationStore';
import AuthStore from './src/mobx/AuthStore';
import FiveStore from './src/mobx/FiveStore';

const app = new ApplicationStore();
const server = new ServerStore(app);
const auth = new AuthStore(app);
const five = new FiveStore(app);

const stores = {
  server: server,
  app: app,
  auth: auth,
  five: five
};

@observer
export default class App extends Component<{}> {

  render() {
    return (
      <Root>
        <Provider stores={stores}>
          <Astro/>
        </Provider>
      </Root>
    )
  }
}
