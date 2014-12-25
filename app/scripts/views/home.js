var React = require('react'),
    Router = require('react-router'),
    Choices = require('./choices'),
    Store = require('../store'),
    _ = require('underscore');

var Home = React.createClass({
  mixins: [ Router.Navigation ],

  getInitialState() {
    return {
      question: '',
      choices: ['', ''],
      allowMultipleAnswers: false
    }
  },

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label htmlFor="question">Enter a question</label>
        <input id="question"
               type="text"
               value={this.state.question}
               onChange={this.handleQuestionChange}
               required/>
        <Choices list={this.state.choices} onChange={this.handleChoicesChange}/>
        <label>
          <input type="checkbox"
                 value={this.state.allowMultipleAnswers}
                 onChange={this.handleAllowMultipleAnswersChange}/>
          Allow multiple answers?
        </label>
        <button onClick={this.save}>Done</button>
      </form>
    );
  },

  handleSubmit(e) {
    e.preventDefault();
  },

  handleQuestionChange(e) {
    this.setState({ question: e.target.value });
  },

  handleChoicesChange(choice, index) {
    var choices = _.clone(this.state.choices);

    if (choice !== null) {
      if (index >= 0)
        choices[index] = choice;
      else
        choices.push(choice);
    }
    else {
      choices.splice(index, 1);
    }

    this.setState({ choices });
  },

  handleAllowMultipleAnswersChange() {
    this.setState({ allowMultipleAnswers: !this.state.allowMultipleAnswers });
  },

  save() {
    var key = Store.savePoll(this.state);
    this.transitionTo('share', { key });
  }
});

module.exports = Home;
