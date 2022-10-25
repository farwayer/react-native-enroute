import React, {useMemo, useCallback, useRef} from 'react'
import {NativeStackView} from 'react-native-screens/native-stack'
import {StackActions} from '@react-navigation/native'
import keygen from './keygen'


const Pop = StackActions.pop().type


export function Stack({
  paths,
  onNavigateBack,
  options = {},
  children,
  ...props
}) {
  const state = useRef(({
    routes: [],
  })).current

  let count = paths?.length
  if (!count) {
    throw new Error("react-native-enroute: paths must not be empty")
  }

  const topPath = last(paths)

  if (topPath !== lastPath(state.routes)) {
    state.routes = state.routes.slice(0, count)

    if (count > state.routes.length + 1) {
      console.warn(
        "react-native-enroute: paths count is more than routes in stack.\n" +
        "Are you trying to pass paths from another stack?\n" +
        `Paths: [${paths.join(', ')}]\n` +
        `Latest ${state.routes.length + 1} paths will be used.`
      )
      count = state.routes.length + 1
      paths = paths.slice(-count)
    }

    if (topPath !== lastPath(state.routes)) {
      const route = makeRoute(topPath, children)
      state.routes[count - 1] = route
    }

    state.index = count - 1
    state.routeNames = paths
  }

  const navigation = useMemo(() => ({
    emit() {},
    navigate() {},
    dispatch(action) {
      if (action.type !== Pop) return
      onNavigateBack?.()
    },
  }), [onNavigateBack])

  const descriptors = useMemo(() => (
    state.routes.reduce((res, route) => {
      const {key, render, routeOptions} = route
      res[key] = {render, options: {...options, ...routeOptions}, navigation}
      return res
    }, {})
  ), [state.routes, options])

  return (
    <NativeStackView
      {...{state, navigation, descriptors}}
      {...props}
    />
  )
}

export default function createStack(props) {
  return useCallback(routerProps => {
    return <Stack {...routerProps} {...props}/>
  }, [])
}

function makeRoute(path, children) {
  let routeOptions = {}
  let component = children
  while (component?.props) {
    routeOptions = {...routeOptions, ...component.props.routeOptions || {}}
    component = component.props.children
  }

  return {
    key: keygen(),
    name: path,
    render: () => children,
    routeOptions,
  }
}

function last(arr) {
  return arr[arr.length - 1]
}

function lastPath(routes) {
  return last(routes)?.name
}
