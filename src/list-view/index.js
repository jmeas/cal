import _ from 'lodash';
import DomPool from 'dom-pool';
import clamp from '../common/clamp';

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
  },

  _computeIndices({offset, length, min, max, padding}) {
    var endOffset = offset + length - 1;

    // A length of "0" requires that we render nothing. However, the decision
    // to use an inclusive start and end for our indices prevents us from
    // rendering nothing without using weird conventions. The simple algorithm
    // above would cause the endOffset to come before the offset to indicate
    // rendering nothing.
    // Rather than doing that, we just always render at least 1 thing, even when
    // the length requests that we render nothing. The following line provides
    // this little correction.
    endOffset = Math.max(offset, endOffset);

    return {
      firstIndex: clamp(offset - padding, min, max),
      lastIndex: clamp(endOffset + padding, min, max)
    };
  }
});

export default ListView;
