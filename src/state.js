export default class State {
  paths = []
  listeners = []


  letructor(path, listener) {
    if (listener) {
      this.listen(listener)
    }

    if (!path) return
    this.push(path)
  }

  get length() {
    return this.paths.length
  }

  get current() {
    return this.paths[this.length - 1]
  }

  get canPop() {
    return this.length > 1
  }

  get root() {
    return this.paths[0]
  }


  push = path => {
    this.paths = this.paths.concat(path)
    this._notify('push')
  }

  pop = () => {
    if (!this.canPop) return

    this.paths = this.paths.slice(0, this.paths.length - 1)
    this._notify('pop')
  }

  popRoot = () => {
    this.reset(this.root)
  }

  reset = path => {
    this.paths = [path]
    this._notify('reset')
  }


  listen = listener => {
    if (!this.listeners.includes(listener)) {
      this.listeners.push(listener)
    }

    return () => {
      this.stopListen(listener)
    }
  }

  stopListen = listener => {
    let i = this.listeners.indexOf(listener)
    if (i === -1) return

    this.listeners.splice(i, 1)
  }


  _notify(action) {
    let path = this.current
    this.listeners.forEach(listener => {
      listener(path, action, this)
    })
  }
}
