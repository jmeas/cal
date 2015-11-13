import _ from 'lodash';
import DomPool from 'dom-pool';
import quantize from '../common/quantize';
import UtilizationView from '../utilization-view';
import EmployeeNodeManager from './employee-node-manager';
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
  this._setEl();
  this._createPool();
  this._createManagers();
}

_.extend(DataContainerView.prototype, {
  render() {
    var xRawIndices = this._computeHorizontalRawIndices();
    var yRawIndices = this._computeVerticalRawIndices();
    var xIndices = this._computeXIndices(xRawIndices.offset, xRawIndices.length);
    var yIndices = this._computeYIndices(yRawIndices.offset, yRawIndices.length);
    var totalSize = xIndices.lastIndex - xIndices.firstIndex + 1;
    _.times(totalSize, i => {
      this._managers[i].render(yIndices);
    });
  },

  update({scrollLeft, scrollTop, totalSpeed}) {
    // Clear any existing update we might have in store
    clearTimeout(this._deferredUpdate);

    // Quantize and pad our values
    var quantizedScrollLeft = quantize(scrollLeft, this.unitWidth);
    var quantizedWidth = quantize(this.dataContainerDimensions.width, this.unitWidth);
    var quantizedScrollTop = quantize(scrollTop, this.unitHeight);
    var quantizedHeight = quantize(this.dataContainerDimensions.height, this.unitHeight);

    var self = this;
    function callUpdate() {
      self._update({
        scrollLeft: quantizedScrollLeft,
        scrollTop: quantizedScrollTop,
        width: quantizedWidth,
        height: quantizedHeight
      });
    }

    // If the user isn't scrolling too fast, then we do a smart update.
    // Otherwise, we schedule an update for the future, when they might
    // be scrolling a bit slower.
    if (!totalSpeed || totalSpeed < 6) {
      callUpdate();
    } else {
      this._deferredUpdate = window.setTimeout(() => {
        callUpdate();
      }, 50);
    }
  },

  // Keeps track of whether or not we have a scheduled render. This comes into play
  // when the user is scrolling really fast.
  _deferredUpdate: undefined,

  _update(options) {
    this._managerManager(options)
  },

  _setEl() {
    this.el = document.getElementsByClassName('data-container')[0];
    this.data = document.getElementsByClassName('data')[0];
  },

  _createPool() {
    this.pool = new DomPool({
      tagName: 'div'
    });
    this.pool.allocate(DEFAULT_POOL_SIZE);
  },

  _createManagers() {
    this._managers = _.map(this.employees, e => new EmployeeNodeManager({
      employee: e,
      pool: this.pool
    }));
    this._managerManager = new ManagerManager({
      managers: this._managers
    });
  },

  _computeHorizontalRawIndices() {
    return {
      offset: this.initialXIndex,
      length: quantize(this.dataContainerDimensions.width, this.unitWidth)
    };
  },

  _computeVerticalRawIndices() {
    return {
      offset: this.initialYIndex,
      length: quantize(this.dataContainerDimensions.height, this.unitHeight)
    };
  },

  _computeXIndices(offset, length) {
    var endOffset = offset + length;
    var startPadding = Math.min(X_PADDING, offset);
    var bottomPadding = Math.min(X_PADDING, this.employees.length - endOffset);
    var firstIndex = offset - startPadding;
    var lastIndex = endOffset + bottomPadding;
    return {firstIndex, lastIndex};
  },

  _computeYIndices(offset, length) {
    var endOffset = offset + length;
    var startPadding = Math.min(Y_PADDING, offset);
    var bottomPadding = Math.min(Y_PADDING, this.timeline.length - endOffset);
    var firstIndex = offset - startPadding;
    var lastIndex = endOffset + bottomPadding;
    return {firstIndex, lastIndex};
  },
});

export default DataContainerView;
