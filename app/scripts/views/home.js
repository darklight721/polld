var React = require('react/addons'),
    Choices = require('./choices'),
    _ = require('underscore');

var Home = React.createClass({
  getInitialState() {
    return {
      question: '',
      choices: ['', '']
    }
  },
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label htmlFor="question">Enter a question</label>
        <input id="question" type="text" value={this.state.question} onChange={this.handleQuestionChange} required/>
        <Choices list={this.state.choices} onChange={this.handleChoicesChange}/>
        <button type="submit">Done</button>
      </form>
    );
  },
  handleSubmit(e) {
    e.preventDefault();
    console.log('on submit');
  },
  handleQuestionChange(e) {
    this.setState({ question: e.target.value });
  },
  handleChoicesChange(choice, index) {
    var choices = _.extend([], this.state.choices);

    if (choice !== null) {
      if (index >= 0)
        choices[index] = choice;
      else
        choices.push(choice);
    }
    else {
      choices.splice(index, 1);
    }

    this.setState({ choices: choices });
  }
});

module.exports = Home;
