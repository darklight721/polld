var React = require('react'),
    Router = require('react-router'),
  { Link } = Router,
    Store = require('../store'),
    _ = require('underscore');

var Poll = React.createClass({
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
      poll: _.extend({ choices: [] }, Store.getPoll(key))
    }
  },

  getInitialState() {
    return this.getStateFromStore();
  },

  componentWillReceiveProps() {
    this.setState(this.getStateFromStore());
  },

  render() {
    var params = { key: this.state.key };

    return (
      <div className="poll">
        <h2>{this.state.poll.question}</h2>
        <RouteHandler {...this.state}/>
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
