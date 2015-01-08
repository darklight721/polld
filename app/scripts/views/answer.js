var React = require('react'),
    Router = require('react-router'),
  { Link } = Router,
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
      poll: _.extend({ choices: [] }, Store.getPoll(key)),
      answers: _.extend({}, Store.getAnswers(key))
    };
  },

  getInitialState() {
    return this.getStateFromStore();
  },

  componentWillReceiveProps() {
    this.setState(this.getStateFromStore());
  },

  render() {
    var params = this.getParams();

    return (
      <div className="answer">
        <h2>{this.state.poll.question}</h2>
        <ul>{this.state.poll.choices.map(this.renderChoice)}</ul>
        <nav>
          <Link to="share" params={params}>Share</Link>
          <Link to="result" params={params}>View result</Link>
        </nav>
      </div>
    );
  },

  renderChoice(choice, index) {
    return (
      <li key={index}>
        <button className={this.state.answers[index] ? 'active' : ''}
                onClick={this.answer.bind(this, index)}>{choice}</button>
      </li>
    );
  },

  answer(index) {
    var answers = this.getAnswers(index);

    Store.answerPoll(this.state.key, answers);
    this.setState({ answers });
  },

  getAnswers(index) {
    var answers = {};

    if (this.state.poll.allowMultipleAnswers) {
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
