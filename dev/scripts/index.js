import svg4everybody    from 'svg4everybody';
import $                from 'jquery';
import flow             from 'lodash/fp/flow';
import map              from 'lodash/fp/map';
import flatten          from 'lodash/fp/flatten';
import sortBy           from 'lodash/fp/sortBy';

var result = flow(

  map( x => [x, x * 2] ),

  flatten,

  sortBy( x => x )

)([ 1, 2, 3 ]);

console.log( result);

$(() => {
	svg4everybody();
});

/* @ngInject */
function testNgAnnotate($log) {}
