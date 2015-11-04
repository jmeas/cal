import _ from 'lodash';
import employeeGenerator from '../../util/employee-generator';
import NodeManager from '../../util/node-manager';
import quantize from '../../util/quantize';

const PADDING = 7;

function EmployeeAxisView(options) {
  _.extend(this, options);
  this._setEls();
  this._createNodeManager();
}

_.extend(EmployeeAxisView.prototype, {
  _setEls() {
    this.el = document.getElementsByClassName('x-axis')[0];
    this.container = this.el.children[0];
  },

  _createNodeManager() {
    this.nodeManager = new NodeManager({
      dim: 'left',
      unit: this.xAxisCellWidth,
      initialPoolSize: 50,
      el: this.container,
      displayProp: 'name'
    });
  },

  render() {
    var firstIndex = 0;
    var widthIndex = quantize(this.dataContainerDimensions.width, this.xAxisCellWidth);
    var lastIndex = firstIndex + widthIndex;

    var startPadding = Math.min(PADDING, firstIndex);
    var bottomPadding = Math.min(PADDING, this.employees.length - lastIndex);

    firstIndex -= startPadding;
    lastIndex += bottomPadding;

    this.nodeManager.initialRender({
      list: this.employees,
      firstIndex: firstIndex,
      lastIndex: lastIndex
    });

    this.firstIndex = firstIndex;
    this.lastIndex = lastIndex;
  },

  _deferredUpdate: undefined,

  // Updates the view with a new top position
  update({scrollLeft, xSpeed, ySpeed}) {
    // Clear any existing update we might have in store
    clearTimeout(this._deferredUpdate);
    // Quantize and pad our values
    var quantizedScrollLeft = quantize(scrollLeft, this.xAxisCellWidth);
    var quantizedWidth = quantize(this.dataContainerDimensions.width, this.xAxisCellWidth);

    if (!ySpeed || ySpeed < 4) {
      this._update(quantizedScrollLeft, quantizedWidth);
    } else {
      this._deferredUpdate = window.setTimeout(() => {
        this._update(quantizedScrollLeft, quantizedWidth);
      }, 50);
    }
  },

  _update(left, width) {
    var startPadding = Math.min(PADDING, left);
    var bottomPadding = Math.min(PADDING, this.employees.length - left - width);
    var newStart = left - startPadding;
    var newEnd = left + width + bottomPadding;
    this.nodeManager.update({
      list: this.employees,
      firstIndex: newStart,
      lastIndex: newEnd
    });
    this.firstIndex = newStart;
    this.lastIndex = newEnd;
  }
});

export default EmployeeAxisView;
