var Firebase = require('firebase'),
    _ = require('underscore'),
    rootRef = new Firebase('https://darksmint.firebaseio.com/'),
    pollsRef = rootRef.child('polls'),
    answersRef = rootRef.child('answers'),
    pollsStore = {},
    answersStore = window.localStorage;

var Store = {
  savePoll(data) {
    var key = pollsRef.push(data).key();
    this.setPoll(key, data);
    return key;
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

  answerPoll(key, answers) {
    var pollAnswersRef = answersRef.child(key),
        previousAnswers = this.getAnswers(key);

    pollAnswersRef.transaction((currentData) => {
      currentData = currentData || {};

      _.each(previousAnswers, (value, index) => {
        if (value && currentData[index] > 0)
          currentData[index]--;
      });

      _.each(answers, (value, index) => {
        if (value)
          currentData[index] = (currentData[index] || 0) + 1;
      });

      return currentData;
    });

    this.setAnswers(key, answers);
  },

  getPoll(key) {
    return pollsStore[key];
  },

  setPoll(key, data) {
    return (pollsStore[key] = data);
  },

  getAnswers(key) {
    var answers = answersStore.getItem(key);
    return answers ? JSON.parse(answers) : {};
  },

  setAnswers(key, answers) {
    answersStore.setItem(key, JSON.stringify(answers));
  }
};

module.exports = Store;
