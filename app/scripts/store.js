var Firebase = require('firebase'),
    rootRef = new Firebase('https://darksmint.firebaseio.com/'),
    pollsRef = rootRef.child('polls'),
    cache = {};

var Store = {
  savePoll(data) {
    return pollsRef.push(data).key();
  },

  fetchPoll(key) {
    var deferred = $.Deferred(),
        poll = this.getPoll(key);

    if (poll) {
      deferred.resolve(poll);
    }
    else {
      pollsRef.child(key).once(
        'value',
        (snapshot) => deferred.resolve(this.setPoll(key, snapshot.val())),
        () => deferred.reject()
      );
    }

    return deferred.promise();
  },

  getPoll(key) {
    return cache[key];
  },

  setPoll(key, data) {
    return (cache[key] = data);
  }
};

module.exports = Store;
