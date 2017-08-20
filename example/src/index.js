import React from 'react'
import {BackHandler, AppRegistry} from 'react-native'
import {Provider} from 'mobx-react'
import * as stores from 'stores'
import UI from 'ui'


const appStores = {
  router: new stores.Router('/shops'),
};

BackHandler.addEventListener('hardwareBackPress', () => {
  appStores.router.pop();
  return true;
});

function App() {
  return (
    <Provider {...appStores}>
      <UI />
    </Provider>
  )
}

AppRegistry.registerComponent('example', () => App);
