var React = require('react'),
    Router = require('react-router'),
    Choices = require('./choices'),
  { Polls } = require('../store'),
    _ = require('underscore');

var Home = React.createClass({
  mixins: [ Router.Navigation ],

  getInitialState() {
    return {
      title: '',
      choices: ['', ''],
      allowMultipleAnswers: false
    }
  },

  render() {
    return (
      <form className="form" onSubmit={this.handleSubmit}>
        <div className="field">
          <label>Poll Title</label>
          <input className="title"
                 type="text"
                 maxLength="200"
                 placeholder="Enter title here"
                 value={this.state.title}
                 onChange={this.handleTitleChange}
                 onKeyPress={this.handleTitleEnter}
                 required/>
        </div>
        <div className="field">
          <Choices ref="choices"
                   list={this.state.choices}
                   onChange={this.handleChoicesChange}/>
        </div>
        <div className="field">
          <label className="multiple-answers">
            <input type="checkbox"
                   value={this.state.allowMultipleAnswers}
                   onChange={this.handleAllowMultipleAnswersChange}/>
            Allow multiple answers?
          </label>
        </div>
        <div className="form-actions">
          <button>Create poll</button>
        </div>
      </form>
    );
  },

  handleSubmit(e) {
    e.preventDefault();

    var pollId = Polls.create(this.state);
    this.transitionTo('share', { pollId });
  },

  handleTitleChange(e) {
    this.setState({ title: e.target.value });
  },

  handleTitleEnter(e) {
    if (e.which !== 13) return;

    e.preventDefault();
    this.refs.choices.focus(0);
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
