import _ from 'lodash';

// A simple algorithm that lets us "pack" utilizations as tightly as
// possible. This is used by the visualizations to determine whether to
// place a utilization "next" to another one, when there are overlaps.
// Requires that the utilizations be sorted.
export default function({rectangles, startProp, endProp}) {
  // This is a list of the most recent rectangle in each position
  var lastPositions = [];

  _.each(rectangles, r => {
    // If this is our first rectangle, then we place it in the
    // first position.
    if (!lastPositions.length) {
      r.position = 0;
      r.columnSize = 1;
      lastPositions[0] = r;
      return;
    }

    // Find the first position that our rectangle comes after.
    // That's the new position for this rectangle.
    _.find(lastPositions, (p, i) => {
      if (r[startProp] > p[endProp]) {
        r.position = i;
        // The width of the column is always one plus the position
        r.columnSize = i + 1;
        // Update the other things in this column
        _.times(i, n => {
          lastPosition[n].columnSize = i + 1;
        });

        lastPositions[i] = r;
        return true;
      }
    });

    // If we found a position, then we exit
    if (!_.isUndefined(r.position)) { return; }

    // Otherwise, we set this in a new column, and update
    // the width of everything before it.
    var i = lastPositions.length;
    r.position = i;
    r.columnSize = i + 1;
    // Update the other things in this column
    _.times(i, n => {
      lastPositions[n].columnSize = i + 1;
    });
    lastPositions[i] = r;
  });

  return rectangles;
};
