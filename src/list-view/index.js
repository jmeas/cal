import _ from 'lodash';
import DomPool from 'dom-pool';

function ListView(options) {
  _.extend(this, options);
  // The container element is where the individual items are rendered into.
  this.container = this.el.children[0];
  this._createPool();
  this._manager = this._createManager();
}

_.extend(ListView.prototype, {
  render(options = {}) {
    // Clear any existing update we might have in store
    clearTimeout(this._deferredUpdate);

    // If the user isn't scrolling too fast, then we do a smart update.
    // Otherwise, we schedule an update for the future, when they might
    // be scrolling a bit slower.
    if (!options.speed || options.speed < 6) {
      this._update(options);
    } else {
      this._deferredUpdate = window.setTimeout(() => {
        this._update(options);
      }, 50);
    }
  },

  // Keeps track of whether or not we have a scheduled render. This comes into play
  // when the user is scrolling really fast.
  _deferredUpdate: undefined,

  // Tell the NodeListManager to update the list
  _update(options = {}) {
    var managerOptions = this._computeManagerOptions(options);
    this._manager.update(managerOptions);
  },

  _createPool() {
    this.pool = new DomPool({
      tagName: 'div'
    });
    this.pool.allocate(this.poolSize);
  }
});

export default ListView;
