import _ from 'lodash';
import crel from 'crel';

export default function(employees) {
  var children = _.map(employees, e => crel('div', e));
  return crel('div', children);
};
