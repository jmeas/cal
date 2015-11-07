import _ from 'lodash';

// A simple algorithm that lets us "pack" utilizations as tightly as
// possible. This is used by the visualizations to determine whether to
// place a utilization "next" to another one, when there are overlaps.
// Requires that the utilizations be sorted.
export default function({rectangles, startProp, endProp}) {
  // A "group" is a collection of rectangles that are linked by
  // a series of overlaps. A group's width is the max number of
  // columns in the group
  var group = {
    // Every rectangle within this group
    members: [],
    // This keeps track of the current rectangle within each column
    columns: [],
    end: undefined
  };

  _.each(rectangles, (r, index) => {
    // If we have nothing in our group, then this is the first rectangle
    var isEmpty = !group.members.length;
    // Is this utilization after the group?
    var isAfter = r[startProp] > group.end;

    // If we're first, or if we're beyond the group, then we
    // make sure the group is clear, and make a new group.
    if (isEmpty || isAfter) {
      r.position = 0;
      r.groupWidth = 1;
      group.columns = [r];
      group.members = [r];
      group.end = r[endProp];
      return;
    }

    // Add it to the current group
    group.members.push(r);
    // Update the end of the group if this extends its length
    if (r[endProp] > group.end) {
      group.end = r[endProp];
    }

    // Now that we've determined that a group already exists,
    // and that this element belongs in the group, we must
    // determine if it belongs in an existing column. If it
    // does, then the total group size hasn't increased, so
    // we only need to set the column and groupWidth for this
    // rectangle.
    var found = _.find(group.columns, (p, i) => {
      // The rectangle fits into this column if it comes after the
      // existing rectangle in this column.
      var fits = r[startProp] > p[endProp];
      // If it doesn't fit, then we can continue on our search.
      if (!fits) { return; }
      // The position is just this column's width
      r.position = i;
      // And it gets whatever width the group has
      r.groupWidth = p.groupWidth;
      // Make sure we set it in this column position
      group.columns[i] = r;
      return true;
    });

    // If we found an existing column to place the
    // utilization in within the group, then we can exit
    if (!_.isUndefined(found)) { return; }

    // Otherwise, we need to make a new column and update
    // the width of the entire group.
    var i = group.columns.length;
    r.position = i;
    // Update the whole group
    _.each(group.members, m => {
      m.groupWidth = i + 1;
    });
    // Set this rectangle in this column in the group
    group.columns[i] = r;
  });

  return rectangles;
};
