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
    var { key } = this.getParams(),
          poll = Store.getPoll(key) || {},
          subject = getSubject(poll.question),
          url = getUrl(key),
          encUrl = encode(url);

    return { poll, subject, url, encUrl };
  },

  getInitialState() {
    return this.getStateFromStore();
  },

  componentWillReceiveProps() {
    this.setState(this.getStateFromStore());
  },

  render() {
    var params = this.getParams();

    return (
      <div className="share">
        <h2>{this.state.poll.question}</h2>
        <label>Let others answer this poll. Share the link below.</label>
        <input ref="url" type="text" value={this.state.url} onClick={this.selectUrl} readOnly/>
        <ul>
          <li>{this.renderMailLink()}</li>
          <li>{this.renderFacebookLink()}</li>
          <li>{this.renderTwitterLink()}</li>
          <li>{this.renderGooglePlusLink()}</li>
        </ul>
        <nav>
          <Link to="answer" params={params}>Answer poll</Link>
          <Link to="result" params={params}>View result</Link>
        </nav>
      </div>
    );
  },

  renderMailLink() {
    var encSubject = encode(this.state.subject),
        encBody = encode(`${this.state.poll.question}\n\n` +
                         `Answer this poll at:\n` +
                         `${this.state.url}`),
        href = `mailto:?subject=${encSubject}&body=${encBody}`;

    return (
      <a href={href}><i className="icon-mail"></i></a>
    );
  },

  renderFacebookLink() {
    var href = `https://www.facebook.com/sharer/sharer.php?u=${this.state.encUrl}`;

    return (
      <a href={href} target="_blank"><i className="icon-facebook"></i></a>
    );
  },

  renderTwitterLink() {
    var encText = encode(truncate(this.state.subject, 90)),
        href = `https://twitter.com/share?url=${this.state.encUrl}&text=${encText}`;

    return (
      <a href={href} target="_blank"><i className="icon-twitter"></i></a>
    );
  },

  renderGooglePlusLink() {
    var href = `https://plus.google.com/share?url=${this.state.encUrl}`;

    return (
      <a href={href} target="_blank"><i className="icon-google-plus"></i></a>
    );
  },

  selectUrl() {
    this.refs.url.getDOMNode().select();
  }
});

function getSubject(question) {
  return `Poll: ${question}`;
}

function getUrl(key) {
  return `${window.location.origin}/#/${key}`;
}

function encode(text) {
  return encodeURIComponent(text);
}

function truncate(text, length) {
  return text.length > length ? text.substr(0, length) + '...' : text;
}

module.exports = Share;
