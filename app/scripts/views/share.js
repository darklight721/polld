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

  getStateFromStore() {
    var { key } = this.getParams();
    return {
      poll: Store.getPoll(key) || {}
    };
  },

  getInitialState() {
    return this.getStateFromStore();
  },

  componentWillReceiveProps() {
    this.setState(this.getStateFromStore());
  },

  render() {
    var params = this.getParams(),
        url = getUrl(params.key);

    return (
      <div className="share">
        <label>Let others answer this poll. Share the link below.</label>
        <input ref="url" type="text" value={url} onClick={this.selectUrl} readOnly/>
        <ul>
          <li>{this.renderMailLink(url)}</li>
          <li>{this.renderFacebookLink(url)}</li>
          <li>{this.renderTwitterLink(url)}</li>
        </ul>
        <nav>
          <Link to="answer" params={params}>Answer poll</Link>
          <Link to="result" params={params}>View result</Link>
        </nav>
      </div>
    );
  },

  renderMailLink(url) {
    var encSubject = encode(this.getSubject()),
        encBody = encode(`${this.state.poll.question}\n\n` +
                         `Answer this poll at:\n` +
                         `${url}`),
        href = `mailto:?subject=${encSubject}&body=${encBody}`;

    return (
      <a href={href}><i className="icon-mail"></i></a>
    );
  },

  renderFacebookLink(url) {
    var encUrl = encode(url),
        href = `https://www.facebook.com/sharer/sharer.php?u=${encUrl}`;

    return (
      <a href={href} target="_blank"><i className="icon-facebook"></i></a>
    );
  },

  renderTwitterLink(url) {
    var encUrl = encode(url),
        encText = encode(truncate(this.getSubject(), 90)),
        href = `https://twitter.com/share?url=${encUrl}&text=${encText}`;

    return (
      <a href={href} target="_blank"><i className="icon-twitter"></i></a>
    );
  },

  selectUrl() {
    this.refs.url.getDOMNode().select();
  },

  getSubject() {
    return `Poll: ${this.state.poll.question}`;
  }
});

function getUrl(key) {
  return `${window.location.origin}/#/${key}`;
}

function encode(string) {
  return encodeURIComponent(string);
}

function truncate(string, length) {
  return string.length > length ? string.substr(0, length) + '...' : string;
}

module.exports = Share;
