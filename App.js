/**
 * Astro Boiler App
 * https://github.com/astrocket
 * init, 2017.11.21
 */
import React, {
  Component,
} from 'react';
import {
  observer,
} from 'mobx-react/native';
import {
  Root,
} from 'native-base';
import Astro from './Astro';
import { Provider } from 'mobx-react/native';
import ApplicationStore from './src/mobx/ApplicationStore';
const stores = { ApplicationStore };

@observer
export default class App extends Component<{}> {

  render() {
    return (
      <Root>
        <Provider {...stores}>
          <Astro/>
        </Provider>
      </Root>
    )
  }
}
