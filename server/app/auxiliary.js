/*jshint esversion: 6 */

function flatten(tvar, unique = 1) {
  var flattened = [],
    uniques;

  for (var item in tvar) {
    flattened.push(tvar[item].NAME);
  }
  uniques = flattened.filter(distinct);

  return uniques;

  function distinct(value, index, self) {
    return self.indexOf(value) === index;
  }
}

module.exports = {
  flatten: flatten
};
