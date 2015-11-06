import _ from 'lodash';
import quantize from '../../util/quantize';
import NodeManager from '../../util/node-manager';

function AxisView(options) {
  _.extend(this, options);
  this._setContainer();
  this._createNodeManager();
}

_.extend(AxisView.prototype, {
  // Render a fresh list. Should only be called for first renders, or to render
  // a new list. Otherwise, use `update` to do a smart render.
  render(list) {
    if (list) {
      this.list = list;
    }
    var offset = this.initialIndex;
    var length = quantize(this.dataContainerDimensions[this.containerDim], this.unit);
    this._update(offset, length, true);
  },

  // Keeps track of whether or not we have a scheduled render. This comes into play
  // when the user is scrolling really fast.
  _deferredUpdate: undefined,

  // This intelligently updates the view. It only updates if the user isn't scrolling
  // too fast! Otherwise, it waits for them to slow down.
  update({scrollOffset, speed}) {
    // Clear any existing update we might have in store
    clearTimeout(this._deferredUpdate);
    // Quantize and pad our values
    var quantizedScrollLeft = quantize(scrollOffset, this.unit);
    var quantizedWidth = quantize(this.dataContainerDimensions[this.containerDim], this.unit);

    // If the user isn't scrolling too fast, then we do a smart update.
    // Otherwise, we schedule an update for the future, when they might
    // be scrolling a bit slower.
    if (!speed || speed < 6) {
      this._update(quantizedScrollLeft, quantizedWidth);
    } else {
      this._deferredUpdate = window.setTimeout(() => {
        this._update(quantizedScrollLeft, quantizedWidth);
      }, 50);
    }
  },

  // The container element is where the individual items are rendered into.
  _setContainer() {
    this.container = this.el.children[0];
  },

  // The NodeManager manages the smart updating of our list.
  _createNodeManager() {
    this.nodeManager = new NodeManager({
      unit: this.unit,
      el: this.container,
      dim: this.dimension,
      formatFn: this.formatFn,
      displayProp: this.displayProp,
      initialPoolSize: this.poolSize
    });
  },

  // Gets the right indices given an offset (as an index)
  // and a length (in units of indices)
  _getIndices(offset, length) {
    var endOffset = offset + length;
    var startPadding = Math.min(this.padding, offset);
    var bottomPadding = Math.min(this.padding, this.list.length - endOffset);
    var firstIndex = offset - startPadding;
    var lastIndex = endOffset + bottomPadding;
    return {firstIndex, lastIndex};
  },

  // Tell the NodeManager to update the list. Pass `clean` as `true` to
  // render a brand new chunk, rather than doing a smart update.
  _update(offset, length, clean) {
    var {firstIndex, lastIndex} = this._getIndices(offset, length);
    // var method = clean ? 'initialRender' : 'update';
    this.nodeManager.update({
      list: this.list,
      firstIndex,
      lastIndex
    });
    this.firstIndex = firstIndex;
    this.lastIndex = lastIndex;
  }
});

export default AxisView;
