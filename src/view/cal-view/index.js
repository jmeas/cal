import _ from 'lodash';
import TimeAxisView from '../time-axis';
import EmployeeAxisView from '../employee-axis';
import DataContainerView from '../data-container-view';

// The CalView is the parent view of the entire calendar.
// The View itself mostly ensures that the axes and data container
// stay in sync as the user scrolls.
function CalView(options) {
  this._setEl();
  this.setupChildren();
}

_.extend(CalView.prototype, {
  _setEl() {
    this.el = document.getElementsByTagName('main')[0];
  },

  setupChildren() {
    this.timeAxisView = new TimeAxisView();
    this.employeeAxisView = new EmployeeAxisView();
    this.dataContainerView = new DataContainerView();
  },

  // Renders our data for the first time. Should not be called
  // more than once; subsequent updates need to be intelligently
  // rendered with `update()`
  render() {
    this.timeAxisView.render();
    this.employeeAxisView.render();
    this.registerScrollEvent();
    this.registerMousemoveEvent();
  },

  // Update the DOM
  update() {},

  // Whether or not we're currently handling a data scroll
  _handlingDataScroll: false,

  // This ensures that our axes stay lined up with the position
  // of the data container.
  registerScrollEvent() {
    this.dataContainerView.el.addEventListener('scroll', () => {
      if (this._handlingDataScroll) { return; }
      this._handlingDataScroll = true;
      this._onDataContainerScroll();
    });
  },

  _onDataContainerScroll() {
    var {scrollLeft, scrollTop} = this.dataContainerView.el;
    this.timeAxisView.axisList.style.top = `-${scrollTop}px`;
    this.employeeAxisView.axisList.style.left = `-${scrollLeft}px`;
    this._handlingDataScroll = false;
  },

  _handlingMousemove: false,

  // This allows the user to scroll the data by mousewheeling on the axes
  registerMousemoveEvent() {
    this.timeAxisView.el.addEventListener('wheel', this._mousemoveHandler.bind(this));
    this.employeeAxisView.el.addEventListener('wheel', this._mousemoveHandler.bind(this));
  },

  _mousemoveHandler(e) {
    if (this._handlingMousemove) { return; }
    this._handlingMousemove = true;
    this._onMousemove(e);
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
