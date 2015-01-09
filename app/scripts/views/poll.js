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

  getInitialState() {
    return {
      navs: [{ route: 'share', title: 'Share' },
             { route: 'answer', title: 'Answer poll' },
             { route: 'result', title: 'View result' }]
    };
  },

  render() {
    var { pollId } = this.getParams(),
          poll = _.extend({ choices: [] }, Store.getPoll(pollId)),
          props = { pollId, poll };

    return (
      <div className="poll">
        <h2>{poll.question}</h2>
        <RouteHandler {...props}/>
        <nav>{this.state.navs.map(this.renderNav)}</nav>
      </div>
    );
  },

  renderNav(nav, index) {
    return (
      <Link to={nav.route} params={this.getParams()} key={index}>{nav.title}</Link>
    );
  }
});

module.exports = Poll;
