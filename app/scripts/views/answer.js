var React = require('react'),
    Store = require('../store'),
    _ = require('underscore');

var Answer = React.createClass({
  propTypes: {
    pollId: React.PropTypes.string.isRequired,
    poll: React.PropTypes.object.isRequired
  },

  setAnswers(props) {
    this.setState({
      answers: _.extend({}, Store.getAnswers(props.pollId))
    });
  },

  getInitialState() {
    return { answers: {} };
  },

  componentWillMount() {
    this.setAnswers(this.props);
  },

  componentWillReceiveProps(props) {
    this.setAnswers(props);
  },

  render() {
    return (
      <div className="answer">
        <ul>{this.props.poll.choices.map(this.renderChoice)}</ul>
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

    Store.answerPoll(this.props.pollId, answers);
    this.setState({ answers });
  },

  getAnswers(index) {
    var answers = {};

    if (this.props.poll.allowMultipleAnswers) {
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
