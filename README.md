# React Native Enroute

_Simple and fast React Native router based on enroute and react-navigation_

To be honest it is not real router at all. This package contains some helpers
to use [react-enroute](https://github.com/tj/react-enroute)
with [react-navigation](https://github.com/react-community/react-navigation).

Library has very basic functions at the moment. I will complement the
functionality as I need it.  

React Native Enroute plays well in company with Redux and MobX.

## Usage

Complete `react-navigation` installation guide first

```bash
yarn add react-navigation react-navigation-stack react-native-gesture-handler react-native-screens react-native-reanimated
yarn add react-enroute react-native-enroute
```

```js
import {useState, useMemo, useEffect} from 'react'
import {BackHandler, AppRegistry, View, Button} from 'react-native'
import {Router, Route} from 'react-enroute'
import {State, createStack} from 'react-native-enroute'
import {TransitionPresets} from 'react-navigation-stack'
import * as screens from './screens'

function newStack() {
  const preset = TransitionPresets.SlideFromRightIOS

  return createStack({
    // all are optional
    navigationConfig: {
      headerMode: 'none',
    },
    options: {
      gestureEnabled: true,
      gestureDirection: preset.gestureDirection,
      transitionSpec: preset.transitionSpec,
      cardStyleInterpolator: preset.cardStyleInterpolator,
    },
  })
}

function Routes(props) {
  return (
    <Router {...props}>
      <Route path='/shops' component={newStack()}>
        <Route component={screens.ShopList} />
        <Route path=':shop' component={screens.ShopDetail} />
      </Route>
      <Route path='/quest' component={newStack()}>
        <Route component={screens.AllQuestions} />
        <Route path=':q' component={screens.Question} />
      </Route>
    </Router>
  )
}

function App() {
  const [location, setLocation] = useState('/shops')
  const routerState = useMemo(() => new State(location, setLocation), [])

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => {
      routerState.pop()
      return true
    })

    return () => {} // TODO: remove listener
  }, [])

  return (
    <View>
      <Button onPress={() => routerState.push('/shops/123')} />
      <Button onPress={() => routerState.reset('/quest/1')} />
      <Routes location={location} onNavigateBack={routerState.pop} />
    </View>
  )
}

AppRegistry.registerComponent('app', () => App);
```
