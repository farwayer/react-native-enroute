import React, {useMemo, useCallback} from 'react'
import {StackView} from '@react-navigation/stack'
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
  const count = paths?.length
  if (!count) {
    throw new Error("react-native-enroute: paths must not be empty")
  }

  const topPath = last(paths)

  const state = useMemo(() => ({
    routes: [],
  }), [])

  if (topPath !== lastPath(state.routes)) {
    state.routes = state.routes.slice(0, count)
    state.index = count - 1
    state.routeNames = paths

    if (topPath !== lastPath(state.routes)) {
      state.routes[count - 1] = makeRoute(topPath, children)
    }
  }

  const navigation = useMemo(() => ({
    emit() {},
    navigate() {},
    dispatch(action) {
      if (action.type !== Pop) return
      onNavigateBack?.()
    },
  }), [])

  const descriptors = useMemo(() => (
    state.routes.reduce((res, route) => {
      const {key, render} = route
      res[key] = {render, options, navigation}
      return res
    }, {})
  ), [state.routes, options])

  return (
    <StackView
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
  return {
    key: keygen(),
    name: path,
    render: () => children,
  }
}

function last(arr) {
  return arr[arr.length - 1]
}

function lastPath(routes) {
  return last(routes)?.name
}
