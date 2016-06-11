'use strict';
testNgAnnotate.$inject = ["$log"];
var _svg4everybody = require( 'svg4everybody' );
var _svg4everybody2 = _interopRequireDefault( _svg4everybody );
var _jquery = require( 'jquery' );
var _jquery2 = _interopRequireDefault( _jquery );
var _flow = require( 'lodash/fp/flow' );
var _flow2 = _interopRequireDefault( _flow );
var _map = require( 'lodash/fp/map' );
var _map2 = _interopRequireDefault( _map );
var _flatten = require( 'lodash/fp/flatten' );
var _flatten2 = _interopRequireDefault( _flatten );
var _sortBy = require( 'lodash/fp/sortBy' );
var _sortBy2 = _interopRequireDefault( _sortBy );

function _interopRequireDefault( obj ) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var result = (0, _flow2.default)( (0, _map2.default)(function( x ) {
    return [
        x,
        x * 2
    ];
}), _flatten2.default, (0, _sortBy2.default)(function( x ) {
    return x;
}) )([
    1,
    2,
    3
]);
console.log( result );
(0, _jquery2.default)(function() {
    (0, _svg4everybody2.default)();
});
/* @ngInject */
function testNgAnnotate( $log ) {}

//# sourceMappingURL=index.js.map
