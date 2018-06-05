import React, {Component} from 'react'
import {StackView, StateUtils, NavigationActions} from 'react-navigation'


export class Stack extends Component {
  static defaultProps = {
    options: {},
    onNavigateBack: () => {},
  };

  navState = {
    index: -1,
    routes: [],
    isTransitioning: true,
  };

  render() {
    const {location, options, onNavigateBack, children, ...props} = this.props;
    const index = StateUtils.indexOf(this.navState, location);

    if (index === -1) {
      this.push();
    } else {
      this.popToIndex(index);
    }

    const navigation = {
      state: this.navState,
      dispatch: ({type}) => {
        if (type !== NavigationActions.BACK) return;
        onNavigateBack();
      },
      goBack: onNavigateBack,
    };

    const descriptors = this.navState.routes.reduce((descs, route) => {
      const {key, component} = route;
      const getComponent = () => component;
      descs[key] = {options, getComponent, navigation};
      return descs;
    }, {});

    return (
      <StackView
        onTransitionEnd={this.onTransitionEnd}
        {...{descriptors, navigation}}
        {...props}
      />
    )
  }

  push() {
    const route = this.currentRoute();
    this.navState = StateUtils.push(this.navState, route);
  }

  popToIndex(index) {
    this.navState = {...this.navState, index};
  }

  currentRoute() {
    const {location: key, children} = this.props;
    const component = () => children;
    return {key, component};
  }

  onTransitionEnd = (transition, last) => {
    const currentIndex = transition.navigation.state.index;
    const prevIndex = last.navigation.state.index;
    if (currentIndex >= prevIndex) return;

    this.navState.routes = this.navState.routes.slice(0, currentIndex + 1);
  };
}

export default function createStack(props={}) {
  return routerProps => (
    <Stack {...routerProps} {...props} />
  )
}
