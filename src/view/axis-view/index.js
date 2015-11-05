import _ from 'lodash';
import NodeManager from '../../util/node-manager';
import quantize from '../../util/quantize';

function AxisView(options) {
  _.extend(this, options);
  this._setContainer();
  this._createNodeManager();
}

_.extend(AxisView.prototype, {
  _setContainer() {
    this.container = this.el.children[0];
  },

  _createNodeManager() {
    this.nodeManager = new NodeManager({
      dim: this.dimension,
      unit: this.unit,
      initialPoolSize: this.poolSize,
      el: this.container,
      displayProp: this.displayProp,
      formatFn: this.formatFn
    });
  },

  render(list) {
    if (list) {
      this.list = list;
    }
    var firstIndex = this.initialIndex;
    var widthIndex = quantize(this.dataContainerDimensions[this.containerDim], this.unit);
    var lastIndex = firstIndex + widthIndex;

    var startPadding = Math.min(this.padding, firstIndex);
    var bottomPadding = Math.min(this.padding, this.list.length - lastIndex);

    var padding = Math.min(startPadding, bottomPadding);

    firstIndex -= padding;
    lastIndex += padding;

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
  update({scrollOffset, speed}) {
    // Clear any existing update we might have in store
    clearTimeout(this._deferredUpdate);
    // Quantize and pad our values
    var quantizedScrollLeft = quantize(scrollOffset, this.unit);
    var quantizedWidth = quantize(this.dataContainerDimensions[this.containerDim], this.unit);

    if (!speed || speed < 6) {
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
    var padding = Math.min(startPadding, bottomPadding);
    var newStart = left - padding;
    var newEnd = left + width + padding;
    this.nodeManager.update({
      list: this.list,
      firstIndex: newStart,
      lastIndex: newEnd
    });
    this.firstIndex = newStart;
    this.lastIndex = newEnd;
  }
});

export default AxisView;
