import {observable, action, computed} from 'mobx'
import {State} from 'react-native-enroute'


export default class Router {
  @observable
  location = null;

  @observable
  canPop = false;

  state = null;


  constructor(location) {
    this.state = new State(location, this._update);
  }

  push = location => {
    requestAnimationFrame(() => {
      this.state.push(location);
    });
  };

  reset = location => {
    requestAnimationFrame(() => {
      this.state.reset(location);
    });
  };

  pop = () => {
    requestAnimationFrame(() => {
      this.state.pop();
    });
  };


  @action _update = (location, _, state) => {
    this.location = location;
    this.canPop = state.canPop;
  }
}
