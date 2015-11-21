import _ from 'lodash';
import ListView from '../list-view';
import NodeListManager from './node-list-manager';

function AxisView(options) {
  ListView.call(this, options);
}

// "Extend" from the ListView
AxisView.prototype = _.create(ListView.prototype, {
  constructor: AxisView
});

_.extend(AxisView.prototype, {
  // The NodeListManager manages the smart updating of our list.
  _createManager() {
    return new NodeListManager({
      unit: this.unit,
      el: this.container,
      dim: this.dimension,
      formatFn: this.formatFn,
      displayProp: this.displayProp,
      pool: this.pool
    });
  },

  _computeManagerOptions(options) {
    var {offset, length} = options;
    // If we don't have a scrollOffset, then we use the initial index. This happens
    // when it's an initial render. We assume that the list is always larger than
    // the initialIndex. For this app, that will be the case (as this feature is only
    // used on the y axis). Keep in mind that this is not a general solution.
    if (_.isUndefined(offset)) {
      offset = this.initialIndex;
    }

    // Pad our indices
    var {firstIndex, lastIndex} = this._getIndices(offset, length);

    return {
      list: this.list,
      firstIndex,
      lastIndex
    };
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
