import _ from 'lodash';
import dateFormatter from './date-formatter';
import DomPool from 'dom-pool';

var divPool = new DomPool({ tagName: 'div' });
divPool.allocate(100);

export default {
  pool: divPool,

  generate(timeline, {back, height, cellHeight, padding}) {
    // This padding doesn't need to be truncated at the moment, as this is
    // only called for the first render.
    var start = back - padding;
    var end = start + height + 2 * padding;

    // We never need to loop through every date, because we're only
    // ever dealing with a chunk of those dates.
    var totalSize = end - start;
    var formattedDate, el, date;
    var fragment = document.createDocumentFragment();
    _.times(totalSize, n => {
      date = timeline[start + n];
      formattedDate = dateFormatter(date, 'word');
      el = divPool.pop();
      el.textContent = formattedDate;
      el.style.top = `${(start + n) * cellHeight}px`;
      fragment.appendChild(el);
    });

    var node = divPool.pop();
    node.appendChild(fragment);
    return { start, end, node };
  }
};
