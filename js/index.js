'use strict';
testNgAnnotate.$inject = ["$log"];
var _lib = require( 'lib' );
var _lib2 = _interopRequireDefault( _lib );

function _interopRequireDefault( obj ) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var message = 'hello world';
var test = function test() {
    console.info( message );
};
test();
var getDate = function getDate() {
    return new Date();
};
console.log( getDate() );
/* @ngInject */
function testNgAnnotate( $log ) {}

//# sourceMappingURL=index.js.map
