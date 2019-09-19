import React, {useState, useMemo} from 'react'
import StackView from 'react-navigation-stack/src/views/Stack/StackView'
import {StackActions} from 'react-navigation'


export function Stack({
  location,
  navigationConfig = {},
  options = {},
  onNavigateBack = () => {},
  children,
  ...props
}) {
  const [state, setState] = useState({
    index: 0,
    routes: [route(location, children)],
  })

  const index = state.routes.findIndex(route => route.key === location)
  switch (index) {
    case state.index: break

    // push
    case -1: setState({
      index: state.index + 1,
      routes: state.routes.concat(route(location, children)),
    })
      break

    // pop to index
    default: setState({
      index,
      routes: state.routes.slice(0, index + 1),
    })
  }

  const navigation = useMemo(() => ({
    state,
    dispatch(action) {
      if (action.type !== StackActions.POP) return
      if (action.key !== location) return
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

function route(location, children) {
  return {
    key: location,
    Component: () => children,
  }
}
