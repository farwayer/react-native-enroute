# React Native Enroute

_Simple and fast React Native router based on enroute and react-navigation_

Why? Because I need **fast** JS React Native router with adequate JSX declarative
syntax.  

To be honest it is not real router at all. This package contains some helper
wrappers and functions to use [react-enroute](https://github.com/tj/react-enroute)
with [react-navigation](https://github.com/react-community/react-navigation).

Library has very basic functions at the moment. I will complement the
functionality as I need it.  

React Native Enroute plays well in company with Redux and MobX.


1. [Installation](https://github.com/farwayer/react-native-enroute#installation)
2. [Usage](https://github.com/farwayer/react-native-enroute#usage)
3. [Changelog](https://github.com/farwayer/react-native-enroute#changelog)


## Installation

```bash
npm install --save react-enroute react-navigation@2.0.0-rc.9 react-native-enroute
```

## Usage

```js
import React from 'react'
import {BackHandler, AppRegistry, Animated, Easing} from 'react-native'
import {Router, Route} from 'react-enroute'
import {State, createStack} from 'react-native-enroute'
import StackViewStyleInterpolator from 'react-navigation/src/views/StackView/StackViewStyleInterpolator'
import * as screens from './screens'

const TransitionSpec = {
  duration: 500,
  easing: Easing.bezier(0.2833, 0.99, 0.31833, 0.99),
  timing: Animated.timing,
};

const SlideFromRight = {
  transitionSpec: TransitionSpec,
  screenInterpolator: StackViewStyleInterpolator.forHorizontal,
};

function newStack() {
  return createStack({
    navigationConfig: {
      headerMode: 'none',
      transitionConfig: () => SlideFromRight,
    },
    options: {
      gesturesEnabled: true,
    },
  });
}

function Routes({location, onNavigateBack}) {
  return (
    <Router {...{location, onNavigateBack}}>
      <Route path='/shops' component={newStack()}>
        <Route path='' component={screens.ShopList} />
        <Route path=':shop' component={screens.ShopDetail} />
      </Route>
      <Route path='/quest' component={newStack()}>
        <Route path=':q' component={screens.Question} />
      </Route>
    </Router>
  )
}

class App extends React.Component {
  routerState = null;
  
  state = {
    location: '/shops',
  };
  
  constructor(props) {
    super(props);
    this.routerState = new State(this.state.location, this._updateLocation);
  }
  
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', () => {
      this.routerState.pop();
      return true;
    });    
  }
  
  render() {
    return (
      <View>
        <Button onPress={() => this.routerState.push('/shops/123')} />
        <Button onPress={() => this.routerState.reset('/quest/1')} />
        <Routes location={this.state.location} />
      </View>
    )
  }
  
  _updateLocation = (location, action, state) => {
    this.setState({location});
  };
}

AppRegistry.registerComponent('app', () => App);
```

## Changelog

### 2.0.0

- use react-navigation 2-rc

### 1.1.1

- fix component can be rendered several times

### 1.1.0

- adaptation to latest react-navigation (1.2.1)

### 1.0.0

- first public release
