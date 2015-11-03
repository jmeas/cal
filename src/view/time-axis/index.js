import _ from 'lodash';
import timelineGenerator from '../../util/timeline-generator';
import dateFormatter from '../../util/date-formatter';
import NodeManager from '../../util/node-manager';
import quantize from '../../util/quantize';
import dateUtil from '../../util/date-util';

// The total number of nodes that can be added/removed for an update
// to be considered 'small.' Small updates occur immediately; large
// updates are delayed 50ms to prevent large paints as the user scrolls
const SMALL_UPDATE_DELTA = 12;

// How many items we render before and after the viewport to create
// the illusion of a smooth scroll
const PADDING = 10;

function TimeAxisView(options = {}) {
  _.extend(this, options);
  this._setEls();
  this._createNodeManager();
  this.createAxisData(this.date);
}

_.extend(TimeAxisView.prototype, {
  _setEls() {
    this.el = document.getElementsByClassName('y-axis')[0];
    this.container = this.el.children[0];
  },

  _createNodeManager() {
    this.nodeManager = new NodeManager({
      dim: 'top',
      unit: this.yAxisCellHeight,
      // A pool size of 80 will support every laptop for some time
      initialPoolSize: 80,
      el: this.container,
      displayProp: 'time',
      formatFn(date) {
        return dateFormatter(date, 'word');
      }
    });
  },

  createAxisData(date) {
    this.currentDate = date;
    this.timeAxisData = timelineGenerator({
      referenceDate: date,
      back: this.back,
      forward: this.forward,
      scale: this.scale
    });
  },

  render(date = new Date()) {
    if (!dateUtil.isSameDay(this.currentDate, date)) {
      this.createAxisData(date);
    }

    var firstIndex = this.back;
    var heightIndex = quantize(this.dataContainerDimensions.height, this.yAxisCellHeight);
    var lastIndex = firstIndex + heightIndex;

    firstIndex -= PADDING;
    lastIndex += PADDING;

    this.nodeManager.initialRender({
      list: this.timeAxisData,
      firstIndex: firstIndex,
      lastIndex: lastIndex
    });

    this.firstIndex = firstIndex;
    this.lastIndex = lastIndex;
  },

  _deferredUpdate: undefined,

  // Updates the view with a new top position
  update(scrollTop) {
    // Clear any existing update we might have in store
    clearTimeout(this._deferredUpdate);
    // Quantize and pad our values
    var quantizedScrollTop = quantize(scrollTop, this.yAxisCellHeight);
    var quantizedHeight = quantize(this.dataContainerDimensions.height, this.yAxisCellHeight);
    var topDiff = Math.abs(quantizedScrollTop - this.firstIndex - PADDING);
    var calc = quantizedScrollTop + quantizedHeight - this.lastIndex + PADDING;
    var bottomDiff = Math.abs(calc);
    var delta = topDiff + bottomDiff;

    if (delta < SMALL_UPDATE_DELTA) {
      this._update(quantizedScrollTop, quantizedHeight);
    } else {
      this._deferredUpdate = window.setTimeout(() => {
        this._update(quantizedScrollTop, quantizedHeight);
      }, 50);
    }
  },

  _update(top, height) {
    var startPadding = Math.min(PADDING, top);
    var bottomPadding = Math.min(PADDING, this.timeAxisData.length - top - height);
    var newStart = top - startPadding;
    var newEnd = top + height + bottomPadding;
    this.nodeManager.update({
      list: this.timeAxisData,
      firstIndex: newStart,
      lastIndex: newEnd
    });
    this.firstIndex = newStart;
    this.lastIndex = newEnd;
  }
});

export default TimeAxisView;
