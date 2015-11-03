import _ from 'lodash';
import timelineGenerator from '../../util/timeline-generator';
import dateFormatter from '../../util/date-formatter';
import NodeManager from '../../util/node-manager';
import quantize from '../../util/quantize';
import dateUtil from '../../util/date-util';

// The total number of nodes that can be added/removed for an update
// to be considered 'small.' Small updates occur immediately; large
// updates are delayed 50ms to prevent large paints as the user scrolls
const SMALL_UPDATE_DELTA = 10;

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
      initialPoolSize: 100,
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

    this.nodeManager.update({
      list: this.timeAxisData,
      firstIndex: firstIndex - PADDING,
      lastIndex: lastIndex + PADDING
    });
  },

  _deferredUpdate: undefined,

  // Updates the view with a new top position
  update(scrollTop) {
    // Clear any existing update we might have in store
    // clearTimeout(this._deferredUpdate);
    // // Quantize and pad our values
    // var quantizedScrollTop = quantize(scrollTop, this.yAxisCellHeight);
    // var quantizedHeight = quantize(this.dataContainerDimensions.height, this.yAxisCellHeight);
    // var topDiff = Math.abs(quantizedScrollTop - this.axisChunk.start - PADDING);
    // var calc = quantizedScrollTop + quantizedHeight - this.axisChunk.end + PADDING;
    // var bottomDiff = Math.abs(calc);
    // var delta = topDiff + bottomDiff;

    // if (delta < SMALL_UPDATE_DELTA) {
    //   this._update(quantizedScrollTop, quantizedHeight);
    // } else {
    //   this._deferredUpdate = window.setTimeout(() => {
    //     this._update(quantizedScrollTop, quantizedHeight);
    //   }, 50);
    // }
  },

  _update(top, height) {
    // var startPadding = Math.min(PADDING, top);
    // var bottomPadding = Math.min(PADDING, 360 - top + height);
    // var newStart = top - startPadding;
    // var newEnd = top + height + bottomPadding;
    // var oldStart = this.axisChunk.start;
    // var oldEnd = this.axisChunk.end;
    // var count = 0;
    // _.each(this.axisChunk.node.children, (child, i) => {
    //   // Sometimes `child` can be undefined (?)
    //   if (!child) { return; }
    //   // Update the index to be relative to the whole timeline
    //   i = oldStart + i;
    //   if (i < newStart || i > newEnd) {
    //     child.remove();
    //     timeAxisManager.pool.push(child);
    //     count++;
    //   }
    // });
    // this.axisChunk.start = newStart;
    // this.axisChunk.end = newEnd;
  }
});

export default TimeAxisView;
