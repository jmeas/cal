import _ from 'lodash';
import timelineGenerator from '../../util/timeline-generator';
import timeAxisManager from '../../util/time-axis-manager';
import quantize from '../../util/quantize';

// The total number of nodes that can be added/removed for an update
// to be considered 'small.' Small updates occur immediately; large
// updates are delayed 50ms to prevent large paints as the user scrolls
const SMALL_UPDATE_DELTA = 10;
const PADDING = 10;

function TimeAxisView({ dataContainerDimensions, yAxisCellHeight }) {
  this.yAxisCellHeight = yAxisCellHeight;
  this.dataContainerDimensions = dataContainerDimensions;
  this._setEl();
}

_.extend(TimeAxisView.prototype, {
  _setEl() {
    this.el = document.getElementsByClassName('y-axis')[0];
  },

  render() {
    var timeAxisData = timelineGenerator({
      referenceDate: new Date(),
      back: 180,
      forward: 180,
      scale: 'days'
    });
    var timeAxisChunk = timeAxisManager.generate(timeAxisData, {
      back: Math.floor(180 * 5 / 7),
      height: quantize(this.dataContainerDimensions.height, this.yAxisCellHeight),
      cellHeight: this.yAxisCellHeight,
      padding: PADDING
    });
    this.el.appendChild(timeAxisChunk.node);
    this.axisChunk = timeAxisChunk;
  },

  _deferredUpdate: undefined,

  // Updates the view with a new top position
  update(scrollTop) {
    // Clear any existing update we might have in store
    clearTimeout(this._deferredUpdate);
    // Quantize and pad our values
    var quantizedScrollTop = quantize(scrollTop, this.yAxisCellHeight);
    var quantizedHeight = quantize(this.dataContainerDimensions.height, this.yAxisCellHeight);
    var topDiff = Math.abs(quantizedScrollTop - this.axisChunk.start - PADDING);
    var bottomDiff = Math.abs(quantizedScrollTop + quantizedHeight - this.axisChunk.end + PADDING);
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
    var bottomPadding = Math.min(PADDING, 360 - top + height);
    var newStart = top - startPadding;
    var newEnd = top + height + bottomPadding;
    var oldStart = this.axisChunk.start;
    var oldEnd = this.axisChunk.end;
    var count = 0;
    _.each(this.axisChunk.node.children, (child, i) => {
      // Sometimes `child` can be undefined (?)
      if (!child) { return; }
      // Update the index to be relative to the whole timeline
      i = oldStart + i;
      if (i < newStart || i > newEnd) {
        child.remove();
        timeAxisManager.pool.push(child);
        count++;
      }
    });
    this.axisChunk.start = newStart;
    this.axisChunk.end = newEnd;
  }
});

export default TimeAxisView;
