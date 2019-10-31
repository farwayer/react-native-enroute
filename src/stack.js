import React, {useState, useMemo, useEffect} from 'react'
import StackView from 'react-navigation-stack/src/views/Stack/StackView'
import {StackActions} from 'react-navigation'
import keygen from './keygen'


export default function Stack({
  paths,
  navigationConfig = {},
  options = {},
  onNavigateBack = () => {},
  children,
  ...props
}) {
  const count = paths?.length
  if (!count) {
    throw new Error("react-native-enroute: paths must not be empty")
  }

  const [state, setState] = useState(() => {
    const topPath = paths[count - 1]
    return {
      index: 0,
      routes: [makeRoute(topPath, children)],
    }
  })

  useEffect(() => {
    const routes = paths.reduce((res, path, i) => {
      let route = state.routes[i]

      if (route?.path !== path) {
        route = makeRoute(path, children)
      }

      res.push(route)
      return res
    }, [])

    setState({
      index: count - 1,
      routes,
    })
  }, [count, children])

  const navigation = useMemo(() => ({
    state,
    dispatch(action) {
      if (action.type !== StackActions.POP) return

      // POP arrives both for user swipe/back-button and for new routes state
      // we call onNavigateBack() only for user activity
      const topKey = state.routes[state.routes.length - 1].key
      if (action.key !== topKey) return

      onNavigateBack()
    },
  }), [state])

  const descriptors = useMemo(() => (
    state.routes.reduce((res, route) => {
      const {key, Component} = route
      const getComponent = () => Component
      res[key] = {getComponent, options, navigation}
      return res
    }, {})
  ), [state.routes, navigation])

  return (
    <StackView
      {...{navigation, descriptors, navigationConfig}}
      {...props}
    />
  )
}

function makeRoute(path, children) {
  return {
    key: keygen(),
    path,
    Component: () => children,
  }
}
