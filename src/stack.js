import React, {useState, useMemo, useEffect} from 'react'
import StackView from 'react-navigation-stack/src/views/Stack/StackView'
import {StackActions} from 'react-navigation'
import keygen from './keygen'


export function Stack({
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

  const topPath = paths[count - 1]
  const [state, setState] = useState(() => ({
    index: 0,
    routes: [makeRoute(topPath, children)],
  }))

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
      // POP arrives both for user swipe/back-button and for new routes
      // we call onNavigateBack() only for user activity
      if (action.key !== topPath) return
      onNavigateBack()
    },
  }), [state])

  const descriptors = useMemo(() => (
    state.routes.reduce((res, route) => {
      const {key, Component} = route
      const getComponent = () => Component
      res[key] = {getComponent, options}
      return res
    }, {})
  ), [state.routes])

  return (
    <StackView
      {...{navigation, descriptors, navigationConfig}}
      {...props}
    />
  )
}

export default function createStack(props) {
  return routerProps => (
    <Stack {...routerProps} {...props} />
  )
}

function makeRoute(path, children) {
  return {
    key: keygen(),
    path,
    Component: () => children,
  }
}
