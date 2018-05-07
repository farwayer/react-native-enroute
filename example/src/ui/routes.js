import React from 'react'
import {Animated, Easing} from 'react-native'
import {inject} from 'mobx-react'
import {Router, Route} from 'react-enroute'
import {createStack} from 'react-native-enroute'
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
    </Router>
  )
}

export default inject(({router}) => {
  const {location, pop} = router;
  return {location, onNavigateBack: pop};
})(Routes)
