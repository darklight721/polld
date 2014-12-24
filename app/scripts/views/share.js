var React = require('react'),
    Router = require('react-router'),
  { Link } = Router,
    Store = require('../store');

var Share = React.createClass({
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
    var params = this.getParams(),
        url = getUrl(params.key);

    return (
      <div>
        Link:
        <span>{url}</span>
        <Link to="answer" params={params}>Answer</Link>
        <Link to="result" params={params}>Result</Link>
      </div>
    );
  }
});

function getUrl(key) {
  return `${window.location.origin}/#/${key}`;
}

module.exports = Share;
