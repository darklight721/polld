var React = require('react'),
    Store = require('../store');

var Result = React.createClass({
  statics: {
    willTransitionTo(transition, params) {
      transition.wait(
        Store.fetchPoll(params.key)
             .then((data) => !data && transition.redirect('404'))
      );
    }
  },

  render() {
    return (
      <div>
        Result
      </div>
    );
  }
});

module.exports = Result;
