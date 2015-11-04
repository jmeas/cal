import _ from 'lodash';
import timelineGenerator from '../../util/timeline-generator';
import dateFormatter from '../../util/date-formatter';
import NodeManager from '../../util/node-manager';
import quantize from '../../util/quantize';
import dateUtil from '../../util/date-util';

function TimeAxisView(options) {
  _.extend(this, options);
  this._setContainer();
  this._createNodeManager();
}

_.extend(TimeAxisView.prototype, {
  _setContainer() {
    this.container = this.el.children[0];
  },

  _createNodeManager() {
    this.nodeManager = new NodeManager({
      dim: this.dimension,
      unit: this.unit,
      // A pool size of 80 will support every laptop for some time
      initialPoolSize: this.poolSize,
      el: this.container,
      displayProp: this.displayProp,
      formatFn(date) {
        return dateFormatter(date, 'word');
      }
    });
  },

  render() {
    var firstIndex = this.back;
    var heightIndex = quantize(this.dataContainerDimensions.height, this.unit);
    var lastIndex = firstIndex + heightIndex;

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
  update({scrollTop, xSpeed, ySpeed}) {
    // Clear any existing update we might have in store
    clearTimeout(this._deferredUpdate);
    // Quantize and pad our values
    var quantizedScrollTop = quantize(scrollTop, this.unit);
    var quantizedHeight = quantize(this.dataContainerDimensions.height, this.unit);

    if (!ySpeed || ySpeed < 4) {
      this._update(quantizedScrollTop, quantizedHeight);
    } else {
      this._deferredUpdate = window.setTimeout(() => {
        this._update(quantizedScrollTop, quantizedHeight);
      }, 50);
    }
  },

  _update(top, height) {
    var startPadding = Math.min(this.padding, top);
    var bottomPadding = Math.min(this.padding, this.list.length - top - height);
    var newStart = top - startPadding;
    var newEnd = top + height + bottomPadding;
    this.nodeManager.update({
      list: this.list,
      firstIndex: newStart,
      lastIndex: newEnd
    });
    this.firstIndex = newStart;
    this.lastIndex = newEnd;
  }
});

export default TimeAxisView;
