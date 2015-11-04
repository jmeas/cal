import _ from 'lodash';
import employeeGenerator from '../../util/employee-generator';
import NodeManager from '../../util/node-manager';
import quantize from '../../util/quantize';

function EmployeeAxisView(options) {
  _.extend(this, options);
  this._setContainer();
  this._createNodeManager();
}

_.extend(EmployeeAxisView.prototype, {
  _setContainer() {
    this.container = this.el.children[0];
  },

  _createNodeManager() {
    this.nodeManager = new NodeManager({
      dim: this.dimension,
      unit: this.unit,
      initialPoolSize: this.poolSize,
      el: this.container,
      displayProp: this.displayProp
    });
  },

  render() {
    var firstIndex = 0;
    var widthIndex = quantize(this.dataContainerDimensions.width, this.unit);
    var lastIndex = firstIndex + widthIndex;

    var startPadding = Math.min(this.padding, firstIndex);
    var bottomPadding = Math.min(this.padding, this.list.length - lastIndex);

    firstIndex -= startPadding;
    lastIndex += bottomPadding;

    this.nodeManager.initialRender({
      list: this.list,
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
    var quantizedScrollLeft = quantize(scrollLeft, this.unit);
    var quantizedWidth = quantize(this.dataContainerDimensions.width, this.unit);

    if (!ySpeed || ySpeed < 4) {
      this._update(quantizedScrollLeft, quantizedWidth);
    } else {
      this._deferredUpdate = window.setTimeout(() => {
        this._update(quantizedScrollLeft, quantizedWidth);
      }, 50);
    }
  },

  _update(left, width) {
    var startPadding = Math.min(this.padding, left);
    var bottomPadding = Math.min(this.padding, this.list.length - left - width);
    var newStart = left - startPadding;
    var newEnd = left + width + bottomPadding;
    this.nodeManager.update({
      list: this.list,
      firstIndex: newStart,
      lastIndex: newEnd
    });
    this.firstIndex = newStart;
    this.lastIndex = newEnd;
  }
});

export default EmployeeAxisView;
