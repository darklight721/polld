var Firebase = require('firebase'),
    Promise = require('promise'),
    _ = require('underscore'),
    rootRef = new Firebase('https://darksmint.firebaseio.com/'),
    pollsRef = rootRef.child('polls'),
    answersRef = rootRef.child('answers'),
    pollsStore = {},
    answersStore = window.localStorage,
    resultRef = null;

var Store = {
  savePoll(data) {
    var key = pollsRef.push(data).key();
    this.setPoll(key, data);
    return key;
  },

  fetchPoll(key) {
    return new Promise((resolve, reject) => {
      var poll = this.getPoll(key);

      if (poll) {
        resolve(poll);
      }
      else {
        pollsRef.child(key).once(
          'value',
          (snapshot) => resolve(this.setPoll(key, snapshot.val())),
          reject
        );
      }
    });
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
  },

  listenToResult(key, callback) {
    this.stopListeningToResult();

    resultRef = answersRef.child(key);
    resultRef.on('value', (snapshot) => callback(snapshot.val()));
  },

  stopListeningToResult() {
    if (resultRef) {
      resultRef.off('value');
      resultRef = null;
    }
  }
};

module.exports = Store;
