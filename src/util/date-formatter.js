const monthNames = [
  'January', 'February', 'March',
  'April', 'May', 'June', 'July',
  'August', 'September', 'October',
  'November', 'December'
];

const formatMethods = {
  // 2015-10-11
  iso(dd, mm, y) {
    return `${y}-${mm + 1}-${dd}`;
  },

  // Oct 22, 2015
  word(dd, mm, y) {
    var month = monthNames[mm].slice(0, 3);
    return `${month} ${dd}, ${y}`;
  }
};

// `date` must be a Date Object
// `style` must be either `iso` or `word`
export default function(date, style) {
  var dd = date.getDate();
  var mm = date.getMonth();
  var y = date.getFullYear();
  return formatMethods[style](dd, mm, y);
};
