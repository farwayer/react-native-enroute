import React, {Component} from 'react'
import {
  CardStackTransitioner,
  StateUtils,
  NavigationActions,
} from 'react-navigation'


export class Stack extends Component {
  static defaultProps = {
    getScreenOptions: (navigation, props) => ({}),
  };

  navState = {
    index: -1,
    routes: []
  };

  render() {
    const {
      location,
      getScreenOptions,
      onNavigateBack,
      children,
      params,
      ...props,
    } = this.props;
    const index = StateUtils.indexOf(this.navState, location);

    if (index === -1) {
      this.push();
    } else {
      this.popToIndex(index);
    }

    return (
      <CardStackTransitioner
        navigation={{
          state: this.navState,
          dispatch: ({type}) => {
            if (type !== NavigationActions.BACK) return;
            onNavigateBack();
          },
          goBack: onNavigateBack,
          addListener: () => {},
        }}
        router={{
          getScreenOptions,
          getComponentForRouteName: key => {
            const routeIndex = StateUtils.indexOf(this.navState, key);
            const {component = null} = this.navState.routes[routeIndex] || {};
            return component;
          },
        }}
        {...props}
      />
    );
  }

  push() {
    const route = this.currentRoute();
    this.navState = StateUtils.push(this.navState, route);
  }

  popToIndex(index) {
    this.navState = {
      index,
      routes: this.navState.routes.slice(0, index + 1)
    };
  }

  currentRoute() {
    const {location: key, children} = this.props;
    const component = () => children;
    return {key, component, routeName: key};
  }
}

export default function createStack(props={}) {
  return routerProps => (
    <Stack {...routerProps} {...props} />
  )
}
