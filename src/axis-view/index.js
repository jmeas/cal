import _ from 'lodash';
import quantize from '../common/quantize';
import ListViewMixin from '../common/list-view-mixin';
import NodeListManager from './node-list-manager';

function AxisView(options) {
  _.extend(this, options);
  // The container element is where the individual items are rendered into.
  this.container = this.el.children[0];
  this._createNodeListManager();
}

_.extend(AxisView.prototype, ListViewMixin, {
  // The NodeListManager manages the smart updating of our list.
  _createNodeListManager() {
    this.nodeListManager = new NodeListManager({
      unit: this.unit,
      el: this.container,
      dim: this.dimension,
      formatFn: this.formatFn,
      displayProp: this.displayProp,
      initialPoolSize: this.poolSize
    });
  },

  // Keeps track of whether or not we have a scheduled render. This comes into play
  // when the user is scrolling really fast.
  _deferredUpdate: undefined,

  // Tell the NodeListManager to update the list
  _update(options = {}) {
    var scrollOffset = options.scrollOffset;
    // If we don't have a scrollOffset, then we use the initial index. This happens
    // when it's an initial render. We assume that the list is always larger than
    // the initialIndex. For this app, that will be the case (as this feature is only
    // used on the y axis). Keep in mind that this is not a general solution.
    if (_.isUndefined(scrollOffset)) {
      scrollOffset = this.initialIndex * this.unit;
    }

    // Quantize and pad our values
    var quantizedOffset = quantize(scrollOffset, this.unit);
    var length = this.dataContainerDimensions[this.containerDim];
    var quantizedLength = quantize(length, this.unit, {cover: true});
    var {firstIndex, lastIndex} = this._getIndices(quantizedOffset, quantizedLength);
    this.nodeListManager.update({
      list: this.list,
      firstIndex,
      lastIndex
    });
  },

  // Gets the right indices given an offset (as an index)
  // and a length (in units of indices)
  _getIndices(offset, length) {
    var endOffset = offset + length;
    var startPadding = Math.min(this.padding, offset);
    var bottomPadding = Math.min(this.padding, this.list.length - endOffset - 1);
    var firstIndex = offset - startPadding;
    var lastIndex = endOffset + bottomPadding;
    return {firstIndex, lastIndex};
  }
});

export default AxisView;
