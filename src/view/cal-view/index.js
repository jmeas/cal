import _ from 'lodash';
import TimeAxisView from '../time-axis';
import EmployeeAxisView from '../employee-axis';
import DataContainerView from '../data-container-view';
import config from './config';

// The CalView is the parent view of the entire calendar.
// The View itself mostly ensures that the axes and data container
// stay in sync as the user scrolls.
function CalView({employees}) {
  this.scale = config.defaultScale;
  this.employees = employees;
  this.dataContainerDimensions = {};
  this._setEl();
  this.setupChildren();
  this.takeDataContainerMeasurement();
}

_.extend(CalView.prototype, {
  _setEl() {
    this.el = document.getElementsByTagName('main')[0];
  },

  setupChildren() {
    var offsets = config.timelineOffsets[this.scale];
    this.timeAxisView = new TimeAxisView({
      date: new Date(),
      dataContainerDimensions: this.dataContainerDimensions,
      yAxisCellHeight: config.yAxisCellHeight,
      scale: this.scale,
      back: offsets.back,
      forward: offsets.forward
    });
    this.employeeAxisView = new EmployeeAxisView({
      employees: this.employees
    });
    this.dataContainerView = new DataContainerView({
      employees: this.employees
    });
  },

  // Renders our data for the first time. Should not be called
  // more than once; subsequent updates need to be intelligently
  // rendered with `update()`
  render() {
    this.timeAxisView.render();
    this.employeeAxisView.render();
    this.dataContainerView.render();
    this.setScroll();
    // This causes an immediate scroll event because it's synchronous
    // with the above `setScroll`. If I don't want that, I can setTimeout
    // by 25ms, and then manually set the scroll. The axes are smart
    // and won't re-render.
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

  _clearOldScrollData() {
    console.log('CLEARING');
    this._lastTimestamp = null;
    this._lastPositionX = null;
    this._lastPositionY = null;
  },

  _onDataContainerScroll(timestamp) {
    clearTimeout(this._clearScrollDataId);
    var {scrollLeft, scrollTop} = this.dataContainerView.el;
    var ySpeed, xSpeed, tDelta, yDelta, xDelta;
    // console.log('woooo', timestamp, this._lastTimestamp);
    if (this._lastTimestamp) {
      yDelta = scrollTop - this._lastPositionY;
      xDelta = scrollLeft - this._lastPositionX;
      tDelta = timestamp - this._lastTimestamp;
      ySpeed = Math.abs(yDelta / tDelta);
      xSpeed = Math.abs(xDelta / tDelta);
      console.log('ySpeed', ySpeed);
    }

    this.timeAxisView.update(scrollTop);
    this.timeAxisView.container.style.top = `-${scrollTop}px`;
    this.employeeAxisView.axisList.style.left = `-${scrollLeft}px`;
    this._handlingDataScroll = false;

    // Update our new positions and timestamp, then set it to expire in 30ms
    this._lastPositionY = scrollTop;
    this._lastPositionX = scrollLeft;
    this._lastTimestamp = timestamp;
    this._clearScrollDataId = setTimeout(this._clearOldScrollData.bind(this), 30);
  },

  _handlingMousemove: false,

  // This allows the user to scroll the data by mousewheeling on the axes.
  registerMousemoveEvent() {
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
