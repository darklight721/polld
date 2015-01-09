var React = require('react'),
    Router = require('react-router'),
  { RouteHandler, Link } = Router,
    Store = require('../store'),
    _ = require('underscore');

var Poll = React.createClass({
  mixins: [ Router.State ],

  statics: {
    willTransitionTo(transition, params) {
      transition.wait(
        Store.fetchPoll(params.pollId)
             .then((data) => !data && transition.redirect('404'))
      );
    }
  },

  render() {
    var params = this.getParams(),
        pollId = params.pollId,
        poll = _.extend({ choices: [] }, Store.getPoll(pollId)),
        props = { pollId, poll };

    return (
      <div className="poll">
        <h2>{poll.question}</h2>
        <RouteHandler {...props}/>
        <nav>
          <Link to="share" params={params}>Share</Link>
          <Link to="poll" params={params}>Answer poll</Link>
          <Link to="result" params={params}>View result</Link>
        </nav>
      </div>
    );
  }
});

module.exports = Poll;
