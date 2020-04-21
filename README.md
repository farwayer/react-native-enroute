# React Native Enroute

_Simple and fast React Native router based on react-enroute and react-navigation_

[![NPM version](https://img.shields.io/npm/v/react-native-enroute.svg)](https://www.npmjs.com/package/react-native-enroute)

To be honest it is not real router at all. This package contains some wrappers
for using [react-enroute](https://github.com/tj/react-enroute)
with [react-navigation](https://github.com/react-community/react-navigation).
Library plays well with Redux and MobX.

## Usage

Complete [`react-navigation` stack](https://reactnavigation.org/docs/stack-navigator)
installation guide first

```bash
yarn add react-enroute react-native-enroute
```

```js
import {Router} from 'react-enroute'
import {State, createStack} from 'react-native-enroute'
import {TransitionPresets} from '@react-navigation/stack'


function Routes({location, paths, onNavigateBack}) {
  const ShopTab = stack(paths, onNavigateBack)
  const QuestTab = stack(paths, onNavigateBack)

  return (
    <Router {...{location}}>
      <ShopTab path='/shops'>
        <ShopList/>
        <Shop path=':id'/>
      </ShopTab>
      <QuestTab path='/quest'>
        <AllQuestions/>
        <Question path=':id'/>
      </QuestTab>
    </Router>
  )
}

function App() {
  const routerState = useMemo(() => new State('/shops'), [])
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
      <Button onPress={() => routerState.push('/shops/123')}/>
      <Button onPress={() => routerState.reset('/quest/1')}/>
      <Routes
        location={routerState.current}
        paths={routerState.paths}
        onNavigateBack={pop}
      />
    </View>
  )
}

const StackPreset = TransitionPresets.SlideFromRightIOS 
const StackOptions = {
  gestureEnabled: true,
  gestureDirection: StackPreset.gestureDirection,
  transitionSpec: StackPreset.transitionSpec,
  cardStyleInterpolator: StackPreset.cardStyleInterpolator,
} 

function stack(paths, onNavigateBack) {
  return createStack({
    paths, onNavigateBack,
    headerMode: 'none',
    options: StackOptions,
  })
}
```
