var React = require('react'),
    Router = require('react-router'),
    Store = require('../store'),
    _ = require('underscore');

var Answer = React.createClass({
  mixins: [ Router.State ],

  statics: {
    willTransitionTo(transition, params) {
      transition.wait(
        Store.fetchPoll(params.key)
             .then((data) => !data && transition.redirect('404'))
      );
    }
  },

  getStateFromStore() {
    var { key } = this.getParams();
    return {
      key,
      poll: Store.getPoll(key) || {},
      answers: Store.getAnswers(key) || {}
    };
  },

  getInitialState() {
    return this.getStateFromStore();
  },

  componentWillReceiveProps() {
    this.setState(this.getStateFromStore());
  },

  render() {
    return (
      <div>
        {this.state.poll.question}
        <ul>{this.state.poll.choices.map(this.renderChoice)}</ul>
        {this.renderSendButton()}
      </div>
    );
  },

  renderChoice(choice, index) {
    return (
      <li key={index}>
        <button refs={index}
                className={this.state.answers[index] ? 'active' : ''}
                onClick={this.answer.bind(this, index)}>{choice}</button>
      </li>
    );
  },

  renderSendButton() {
    if (this.state.poll.allowMultipleAnswer) {
      return (
        <button>Submit</button>
      );
    }
  },

  answer(index) {
    var answers = this.getAnswers(index);

    Store.answerPoll(this.state.key, answers);
    this.setState({ answers });
  },

  getAnswers(index) {
    var answers = {};

    if (this.state.poll.allowMultipleAnswer) {
      _.extend(answers, this.state.answers);
      answers[index] = !answers[index];
    }
    else {
      answers[index] = true;
    }

    return answers;
  }
});

module.exports = Answer;
