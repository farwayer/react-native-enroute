export default class State {
  paths = [];
  listeners = [];


  constructor(path, listener) {
    if (listener) {
      this.listen(listener);
    }

    if (!path) return;
    this.push(path);
  }

  get length() {
    return this.paths.length;
  }

  get current() {
    return this.paths[this.length - 1];
  }

  get canPop() {
    return this.length > 1;
  }


  push(path) {
    this.paths.push(path);
    this._notify('push');
  }

  pop() {
    if (!this.canPop) return;

    this.paths.pop();
    this._notify('pop');
  }

  reset(path) {
    this.paths = [path];
    this._notify('reset');
  }


  listen(listener) {
    if (!this.listeners.includes(listener)) {
      this.listeners.push(listener);
    }

    return () => {
      this.stopListen(listener);
    }
  }

  stopListen(listener) {
    const i = this.listeners.indexOf(listener);
    if (i === -1) return;

    this.listeners.splice(i, 1);
  }


  _notify(action) {
    const path = this.current;
    this.listeners.forEach(listener => listener(path, action, this));
  }
}
