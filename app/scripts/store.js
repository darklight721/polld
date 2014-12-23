var Firebase = require('firebase'),
    rootRef = new Firebase('https://darksmint.firebaseio.com/'),
    pollsRef = rootRef.child('polls');

exports.savePoll = function(data) {
  return pollsRef.push(data).key();
};
