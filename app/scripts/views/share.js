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
      <div className="share">
        <label>Let others answer this poll. Share the link below.</label>
        <input type="text" value={url} readOnly/>
        <ul>
          <li><a href="#"><i className="icon-clipboard"></i></a></li>
          <li><a href="#"><i className="icon-mail"></i></a></li>
          <li><a href="#" target="_blank"><i className="icon-facebook"></i></a></li>
          <li><a href="#" target="_blank"><i className="icon-twitter"></i></a></li>
        </ul>
        <nav>
          <Link to="answer" params={params}>Answer poll</Link>
          <Link to="result" params={params}>View result</Link>
        </nav>
      </div>
    );
  }
});

function getUrl(key) {
  return `${window.location.origin}/#/${key}`;
}

module.exports = Share;
