# React Native Enroute

_Simple and fast React Native router based on react-enroute and native navigation_

[![NPM version](https://img.shields.io/npm/v/react-native-enroute.svg)](https://www.npmjs.com/package/react-native-enroute)

To be honest it is not real router at all. This package contains some wrappers
for using [react-enroute](https://github.com/tj/react-enroute)
with [react-native-screens](https://github.com/software-mansion/react-native-screens).
Library plays well with Redux and MobX.

## Usage

```bash
yarn add react-native-enroute react-enroute react-native-screens @react-navigation/native @react-navigation/native-stack
```

```js
import {Router} from 'react-enroute'
import {State, createStack} from 'react-native-enroute'
import {ThemeProvider, PreventRemoveProvider} from '@react-navigation/core'
import {DefaultTheme} from '@react-navigation/native'

function Routes({
  location,
  paths,
  onNavigateBack,
}) {
  const ShopTab = createStack({paths, onNavigateBack})
  const QuestTab = createStack({paths, onNavigateBack})

  return (
    <ThemeProvider value={DefaultTheme}>
	    <PreventRemoveProvider>
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
			</PreventRemoveProvider>
		</ThemeProvider>
  )
}

function App() {
  const routerState = useMemo(() => new State('/shops'), [])
  const pop = useCallback(() => {
    routerState.pop()
    return true
  }, [])
  
  const openShop123 = useCallback(() => {
    routerState.push('/shops/123')
  }, [])
  const resetToQuest1 = useCallback(() => {
    routerState.reset('/quest/1')
  }, []) 

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', pop)

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', pop)
    }
  }, [])

  return (
    <View>
      <Button onPress={openShop123}/>
      <Button onPress={resetToQuest1}/>
      <Routes
        location={routerState.current}
        paths={routerState.paths}
        onNavigateBack={pop}
      />
    </View>
  )
}
```
