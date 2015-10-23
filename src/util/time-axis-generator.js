import _ from 'lodash';
import crel from 'crel';
import dateFormatter from './date-formatter';

export default function(timeline) {
  var formattedDate;
  var children = _.map(timeline, date => {
    formattedDate = dateFormatter(date, 'word');
    return crel('div', formattedDate);
  });
  return crel('div', children);
};
