# React Native Enroute

_Simple and fast React Native router based on enroute and react-navigation_

[![NPM version](https://img.shields.io/npm/v/react-native-enroute.svg)](https://www.npmjs.com/package/react-native-enroute)

To be honest it is not real router at all. This package contains some wrappers
that help use [react-enroute](https://github.com/tj/react-enroute)
with [react-navigation](https://github.com/react-community/react-navigation).
Only stack helpers at the moment. Library plays well with Redux and MobX.

## Usage

Complete `react-navigation` installation guide first

```bash
yarn add react-navigation react-navigation-stack react-native-gesture-handler react-native-screens react-native-reanimated
yarn add react-enroute react-native-enroute
```

```js
import {Router, Route} from 'react-enroute'
import {State, createStack} from 'react-native-enroute'
import {TransitionPresets} from 'react-navigation-stack'
import * as screens from './screens'


function Routes(props) {
  return (
    <Router {...props}>
      <Route path='/shops' component={createStack()}>
        <Route component={screens.ShopList} />
        <Route path=':id' component={screens.ShopDetail} />
      </Route>
      <Route path='/quest' component={createCustomStack()}>
        <Route component={screens.AllQuestions} />
        <Route path=':id' component={screens.Question} />
      </Route>
    </Router>
  )
}

function App() {
  const [routerState] = useState(() => new State('/shops'))
  const pop = useCallback(() => {
    routerState.pop()
    return true
  }, [])

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', pop)

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', pop)
    }
  }, [])

  return (
    <View>
      <Button onPress={() => routerState.push('/shops/123')} />
      <Button onPress={() => routerState.reset('/quest/1')} />
      <Routes
        location={routerState.current}
        paths={routerState.paths}
        onNavigateBack={pop}
      />
    </View>
  )
}

function createCustomStack() {
  const preset = TransitionPresets.SlideFromRightIOS

  return createStack({
    headerMode: 'none',
    options: {
      gestureEnabled: true,
      gestureDirection: preset.gestureDirection,
      transitionSpec: preset.transitionSpec,
      cardStyleInterpolator: preset.cardStyleInterpolator,
    },
  })
}
```
