var fs = require('fs');

fs.unlink('.node-gyp', function() {
  console.log('Poof! Its gone!')
})