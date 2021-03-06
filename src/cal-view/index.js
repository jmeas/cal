import _ from 'lodash';
import config from './config';
import AxisView from '../axis-view';
import DataContainerView from '../data-container-view';
import timelineGenerator from './timeline-generator';
import dateUtil from '../common/date-util';
import quantize from '../common/quantize';
import getElementByHook from '../common/get-element-by-hook';

// The CalView is the parent view of the entire calendar.
// The View itself mostly ensures that the axes and data container
// stay in sync as the user scrolls.
function CalView({employees, date}) {
  this.scale = config.defaultScale;
  this.employees = employees;
  this.date = date;
  this.dataContainerDimensions = {};
  this.createTimeline(this.date);
  this.setupChildren();
  this.takeDataContainerMeasurement();
}

_.extend(CalView.prototype, {
  createTimeline(date) {
    var offsets = config.timelineOffsets[this.scale];
    this.timeline = timelineGenerator({
      referenceDate: date,
      back: offsets.back,
      forward: offsets.forward,
      scale: this.scale
    });
  },

  setupChildren() {
    var offsets = config.timelineOffsets[this.scale];
    this.timeAxisView = new AxisView({
      list: this.timeline,
      unit: config.yAxisCellHeight,
      poolSize: 80,
      padding: 15,
      initialIndex: offsets.back,
      displayProp: 'time',
      dimension: 'top',
      formatFn(date) {
        return dateUtil.format(date, 'word');
      },
      el: getElementByHook('y-axis')
    });
    this.employeeAxisView = new AxisView({
      list: this.employees,
      unit: config.xAxisCellWidth,
      poolSize: 50,
      padding: 7,
      initialIndex: 0,
      displayProp: 'name',
      dimension: 'left',
      el: getElementByHook('x-axis')
    });
    this.dataContainerView = new DataContainerView({
      employees: this.employees,
      timeline: this.timeline,
      dataContainerDimensions: this.dataContainerDimensions,
      unitWidth: config.xAxisCellWidth,
      unitHeight: config.yAxisCellHeight,
      initialXIndex: 0,
      initialYIndex: offsets.back,
      el: getElementByHook('data-container')
    });
  },

  // Renders our data for the first time. Should not be called
  // more than once; subsequent updates need to be intelligently
  // rendered with `update()`
  render() {
    var {quantizedWidth, quantizedHeight} = this.computeQuantizedLengths();
    this.timeAxisView.render({
      length: quantizedHeight
    });
    this.employeeAxisView.render({
      length: quantizedWidth
    });
    this.dataContainerView.render({
      width: quantizedWidth,
      height: quantizedHeight
    });
    this.setScroll();
    // This causes an immediate scroll event because it's synchronous
    // with the above `setScroll`. If I don't want that, I could probbaly setTimeout
    // by 25ms, and then manually set the scroll. Nevertheless, the axes are smart
    // and won't re-render as it is now.
    this.registerScrollEvent();
    this.registerMousemoveEvent();
    this.registerResizeEvent();
  },

  setScroll() {
    var offsetBack = config.timelineOffsets[this.scale].back;
    this.dataContainerView.el.scrollTop = offsetBack * config.yAxisCellHeight;
  },

  // Update the DOM
  update() {},

  // The next few properties and methods are for managing the window resize event. We keep a cached
  // version of the data container dimensions so that we can compute the rendered "chunks" of data.
  _handlingResizeEvent: false,

  registerResizeEvent() {
    window.addEventListener('resize', () => {
      if (this._handlingResizeEvent) { return; }
      this._handlingResizeEvent = true;
      requestAnimationFrame(() => {
        this.takeDataContainerMeasurement();
        this._handlingResizeEvent = false;
      });
    });
  },

  takeDataContainerMeasurement() {
    this.dataContainerDimensions.height = this.dataContainerView.el.offsetHeight;
    this.dataContainerDimensions.width = this.dataContainerView.el.offsetWidth;
  },

  // Whether or not we're currently handling a data scroll
  _handlingDataScroll: false,

  // This ensures that our axes stay lined up with the position
  // of the data container.
  registerScrollEvent() {
    this.dataContainerView.el.addEventListener('scroll', () => {
      if (this._handlingDataScroll) { return; }
      this._handlingDataScroll = true;
      requestAnimationFrame(timestamp => {
        this._onDataContainerScroll(timestamp);
      });
    });
  },

  _lastTimestamp: null,
  _lastPositionY: null,
  _lastPositionX: null,
  _clearScrollDataId: null,

  // These are never cleared; they're used for determining the direction
  // of the scroll along each axis
  _cachedPositionY: null,
  _cachedPositionX: null,

  _clearOldScrollData() {
    this._lastTimestamp = null;
    this._lastPositionX = null;
    this._lastPositionY = null;
  },

  _onDataContainerScroll(timestamp) {
    clearTimeout(this._clearScrollDataId);
    var {scrollLeft, scrollTop} = this.dataContainerView.el;
    var ySpeed, xSpeed, tDelta, yDelta, xDelta, totalSpeed, xPercent, yPercent;
    if (this._lastTimestamp) {
      yDelta = scrollTop - this._lastPositionY;
      xDelta = scrollLeft - this._lastPositionX;
      tDelta = timestamp - this._lastTimestamp;
      ySpeed = Math.abs(yDelta / tDelta);
      xSpeed = Math.abs(xDelta / tDelta);
      // This is a simple approximation of the magnitude of the velocity vector. It
      // works fine for the algorithms in use by this app.
      totalSpeed = xSpeed + ySpeed;
    }

    xDirection = Math.sign(scrollLeft - this._cachedPositionX);
    yDirection = Math.sign(scrollTop - this._cachedPositionY);

    // The child views don't need the actual dimensions. Instead, they only
    // need  the quantized values that fit the grid system of the chart.
    var {quantizedLeft, quantizedTop} = this.computeQuantizedOffsets(scrollLeft, scrollTop);
    var {quantizedWidth, quantizedHeight} = this.computeQuantizedLengths();

    this.timeAxisView.render({
      offset: quantizedTop,
      length: quantizedHeight,
      speed: ySpeed,
      direction: yDirection
    });
    this.employeeAxisView.render({
      offset: quantizedLeft,
      length: quantizedWidth,
      speed: xSpeed,
      direction: xDirection
    });
    this.dataContainerView.render({
      left: quantizedLeft,
      top: quantizedTop,
      width: quantizedWidth,
      height: quantizedHeight,
      speed: totalSpeed,
      xDirection,
      yDirection
    });
    this.timeAxisView.container.style.top = `-${scrollTop}px`;
    this.employeeAxisView.container.style.left = `-${scrollLeft}px`;
    this._handlingDataScroll = false;

    // Update our new positions and timestamp, then set it to expire in 30ms
    this._lastPositionY = scrollTop;
    this._lastPositionX = scrollLeft;
    this._cachedPositionY = scrollTop;
    this._cachedPositionX = scrollLeft;
    this._lastTimestamp = timestamp;
    this._clearScrollDataId = setTimeout(this._clearOldScrollData.bind(this), 30);
  },

  computeQuantizedOffsets(left, top) {
    return {
      quantizedLeft: quantize(left, config.xAxisCellWidth),
      quantizedTop: quantize(top, config.yAxisCellHeight)
    };
  },

  computeQuantizedLengths() {
    var width = this.dataContainerDimensions.width;
    var height = this.dataContainerDimensions.height;
    return {
      quantizedWidth: quantize(width, config.xAxisCellWidth, {cover: true}),
      quantizedHeight: quantize(height, config.yAxisCellHeight, {cover: true})
    };
  },

  _handlingMousemove: false,

  // This allows the user to scroll the data by mousewheeling on the axes areas.
  registerMousemoveEvent() {
    var topLeftEl = document.querySelector('.top-left');
    topLeftEl.addEventListener('wheel', this._mousemoveHandler.bind(this));
    this.timeAxisView.el.addEventListener('wheel', this._mousemoveHandler.bind(this));
    this.employeeAxisView.el.addEventListener('wheel', this._mousemoveHandler.bind(this));
  },

  _mousemoveHandler(e) {
    if (this._handlingMousemove) { return; }
    this._handlingMousemove = true;
    requestAnimationFrame(() => {
      this._onMousemove(e);
    });
  },

  _onMousemove(e) {
    var currentTop = this.dataContainerView.el.scrollTop;
    var currentLeft = this.dataContainerView.el.scrollLeft;

    // The wheel delta appears to be throttled by the native scrollbar;
    // this dampening term is based on tests on OSX in Chrome 46
    var changeY = e.wheelDeltaY / 2.4;
    var changeX = e.wheelDeltaX / 2.4;

    var newTop = currentTop - changeY;
    var newLeft = currentLeft - changeX;

    // Clamping may not be necessary. I need to test across browsers
    // var maxHeight = this.dataContainerView.data.height;
    // var maxWidth = this.dataContainerView.data.width;
    // newTop = clamp(newTop, 0, maxHeight);
    // newLeft = clamp(newLeft, 0, maxWidth);
    this.dataContainerView.el.scrollTop = newTop;
    this.dataContainerView.el.scrollLeft = newLeft;
    this._handlingMousemove = false;
  }
});

export default CalView;
