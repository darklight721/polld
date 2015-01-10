var Firebase = require('firebase'),
    Promise = require('promise'),
    _ = require('underscore'),
    rootRef = new Firebase('https://darksmint.firebaseio.com/');

var Memory = {
  store: {},
  set(key, value) { this.store[key] = value },
  get(key) { return this.store[key] }
};

var Local = {
  store: window.localStorage,
  set(key, value) { this.store.setItem(key, JSON.stringify(value)) },
  get(key) { return JSON.parse(this.store.getItem(key)) }
};

var Polls = {
  ref: rootRef.child('polls'),
  store: Memory,

  create(poll) {
    var key = this.ref.push(poll).key();
    this.store.set(key, poll);
    return key;
  },

  fetch(key) {
    return new Promise((resolve, reject) => {
      var poll = this.get(key);

      if (poll) {
        resolve(poll);
      }
      else {
        this.ref.child(key).once('value', (snapshot) => {
          var poll = snapshot.val();
          this.store.set(key, poll);
          resolve(poll);
        }, reject);
      }
    });
  },

  get(key) {
    return this.store.get(key);
  }
};

var Answers = {
  ref: rootRef.child('answers'),
  store: Local,

  set(key, answers) {
    var answersRef = this.ref.child(key),
        previousAnswers = this.get(key);

    answersRef.transaction((currentData) => {
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

    this.store.set(key, answers);
  },

  get(key) {
    return this.store.get(key);
  }
};

var Results = {
  ref: null,

  listen(key, callback) {
    this.stop();

    this.ref = Answers.ref.child(key);
    this.ref.on('value', (snapshot) => callback(snapshot.val()));
  },

  stop() {
    if (!this.ref) return;

    this.ref.off('value');
    this.ref = null;
  }
};

module.exports = { Polls, Answers, Results };
