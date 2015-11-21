import _ from 'lodash';
import DomPool from 'dom-pool';
import UtilizationView from '../utilization-view';
import ListViewMixin from '../common/list-view-mixin';
import ManagerManager from './manager-manager';

// Assuming 20 people are rendered, with 40  dates,
// this is the maximum size of what could be displayed (20 * 40 = 800)
const DEFAULT_POOL_SIZE = 800;
const X_PADDING = 3;
const Y_PADDING = 10;

const MAX_X_SPEED = 6;
const MAX_Y_SPEED = 6;

function DataContainerView(options) {
  _.extend(this, options);
  this.container = this.el.children[0];
  this._createPool();
  this._createManagers();
}

_.extend(DataContainerView.prototype, ListViewMixin, {
  _update(options = {}) {
    var {left, top, width, height, xDirection, yDirection} = options;
    if (_.isUndefined(left)) {
      left = this.initialXIndex;
    }
    if (_.isUndefined(top)) {
      top = this.initialYIndex;
    }

    // Pad the indices
    var {firstXIndex, lastXIndex} = this._computeXIndices(left, width);
    var {firstYIndex, lastYIndex} = this._computeYIndices(top, height);

    this._managerManager.update({
      firstXIndex,
      lastXIndex,
      firstYIndex,
      lastYIndex,
      xDirection,
      yDirection
    });
  },

  _createPool() {
    this.pool = new DomPool({
      tagName: 'div'
    });
    this.pool.allocate(DEFAULT_POOL_SIZE);
  },

  _createManagers() {
    this._managerManager = new ManagerManager({
      employees: this.employees,
      el: this.container
    });
  },

  _computeXIndices(offset, length) {
    var endOffset = offset + length;
    var startPadding = Math.min(X_PADDING, offset);
    var bottomPadding = Math.min(X_PADDING, this.employees.length - endOffset - 1);
    var firstXIndex = offset - startPadding;
    var lastXIndex = endOffset + bottomPadding;
    return {firstXIndex, lastXIndex};
  },

  _computeYIndices(offset, length) {
    var endOffset = offset + length;
    var startPadding = Math.min(Y_PADDING, offset);
    var bottomPadding = Math.min(Y_PADDING, this.timeline.length - endOffset - 1);
    var firstYIndex = offset - startPadding;
    var lastYIndex = endOffset + bottomPadding;
    return {firstYIndex, lastYIndex};
  },
});

export default DataContainerView;
