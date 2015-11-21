// A ListView is a view that view that renders "chunks" of arbitrarily
// long lists. The Axis- and DataContainer Views are both list views
export default {
  render(options = {}) {
    // Clear any existing update we might have in store
    clearTimeout(this._deferredUpdate);

    // If the user isn't scrolling too fast, then we do a smart update.
    // Otherwise, we schedule an update for the future, when they might
    // be scrolling a bit slower.
    if (!options.speed || options.speed < 6) {
      this._update(options);
    } else {
      this._deferredUpdate = window.setTimeout(() => {
        this._update(options);
      }, 50);
    }
  },

  // Keeps track of whether or not we have a scheduled render. This comes into play
  // when the user is scrolling really fast.
  _deferredUpdate: undefined,
};
