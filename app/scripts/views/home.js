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
      <form className="form" onSubmit={this.handleSubmit}>
        <label>Title</label>
        <input className="title"
               type="text"
               maxLength="200"
               placeholder="Enter title here"
               value={this.state.question}
               onChange={this.handleQuestionChange}
               onKeyPress={this.handleQuestionEnter}
               required/>
        <Choices list={this.state.choices} onChange={this.handleChoicesChange}/>
        <label>
          <input type="checkbox"
                 value={this.state.allowMultipleAnswers}
                 onChange={this.handleAllowMultipleAnswersChange}/>
          Allow multiple answers?
        </label>
        <button>Done</button>
      </form>
    );
  },

  handleSubmit(e) {
    e.preventDefault();

    var key = Store.savePoll(this.state);
    this.transitionTo('share', { key });
  },

  handleQuestionChange(e) {
    this.setState({ question: e.target.value });
  },

  handleQuestionEnter(e) {
    if (e.which === 13)
      e.preventDefault();
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
  }
});

module.exports = Home;
