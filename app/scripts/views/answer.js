var React = require('react'),
    Router = require('react-router'),
    Store = require('../store');

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

  render() {
    var { key } = this.getParams(),
        poll = Store.getPoll(key);

    return (
      <div>
        {poll.question}
        <ul>{poll.choices.map(this.renderChoice)}</ul>
      </div>
    );
  },

  renderChoice(choice, index) {
    return (
      <li key={index}><button>{choice}</button></li>
    );
  }
});

module.exports = Answer;
