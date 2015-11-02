import _ from 'lodash';
import crel from 'crel';

export default function(employees) {
  var children = _.map(employees, e => crel('div', e.name));
  return crel('div', children);
};
