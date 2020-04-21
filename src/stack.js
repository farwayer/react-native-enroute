import React, {useState, useMemo, useEffect, useCallback, memo} from 'react'
import {StackView} from '@react-navigation/stack'
import {StackActions} from '@react-navigation/native'
import keygen from './keygen'


const Pop = StackActions.pop().type


export const Stack = memo(({
  paths,
  onNavigateBack,
  options = {},
  children,
  ...props
}) => {
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
    // we will update state only if paths changed
    let updateState = state.routes.length !== count

    const routes = paths.reduce((res, path, i) => {
      let route = state.routes[i]

      if (route?.path !== path) {
        route = makeRoute(path, children)
        updateState = true
      }

      res.push(route)
      return res
    }, [])

    if (!updateState) return
    setState({
      index: count - 1,
      routes,
    })
  }, [count, children])

  const navigation = useMemo(() => ({
    state,
    emit() {},
    dispatch(action) {
      if (action.type !== Pop) return

      // POP arrives both for user swipe/back-button and for new routes state
      // we call onNavigateBack() only for user activity
      const topKey = state.routes[state.routes.length - 1].key
      if (action.source !== topKey) return

      onNavigateBack?.()
    },
  }), [state])

  const descriptors = useMemo(() => (
    state.routes.reduce((res, route) => {
      const {key, render} = route
      res[key] = {render, options, navigation}
      return res
    }, {})
  ), [state.routes, options, navigation])

  return (
    <StackView
      {...{state, navigation, descriptors}}
      {...props}
    />
  )
})

export default function createStack(props) {
  return useCallback(routerProps => {
    return <Stack {...routerProps} {...props}/>
  }, [])
}

function makeRoute(path, children) {
  return {
    key: keygen(),
    path,
    render: () => children,
  }
}
