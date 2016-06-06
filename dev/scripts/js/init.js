import currentTimestamp from 'lib';

const message = 'hello world';

let test = function() {
  console.info(message)
};

test();

let getDate = () => new Date;

console.log(getDate());

/* @ngInject */
function testNgAnnotate($log) {}
