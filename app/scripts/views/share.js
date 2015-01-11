var React = require('react');

var Share = React.createClass({
  propTypes: {
    pollId: React.PropTypes.string.isRequired,
    poll: React.PropTypes.object.isRequired
  },

  render() {
    var subject = getSubject(this.props.poll.title),
        url = getUrl(this.props.pollId),
        encUrl = encode(url),
        params = { subject, url, encUrl };

    return (
      <div className="share">
        <label>Let others answer this poll. Share the link below.</label>
        <input ref="url" type="text" value={url} onClick={this.selectUrl} readOnly/>
        <ul>
          <li>{this.renderMailLink(params)}</li>
          <li>{this.renderFacebookLink(params)}</li>
          <li>{this.renderTwitterLink(params)}</li>
          <li>{this.renderGooglePlusLink(params)}</li>
        </ul>
      </div>
    );
  },

  renderMailLink(params) {
    var encSubject = encode(params.subject),
        encBody = encode(`${this.props.poll.title}\n\n` +
                         `Answer this poll at:\n` +
                         `${params.url}`),
        href = `mailto:?subject=${encSubject}&body=${encBody}`;

    return (
      <a href={href}><i className="icon-mail"></i></a>
    );
  },

  renderFacebookLink(params) {
    var href = `https://www.facebook.com/sharer/sharer.php?u=${params.encUrl}`;

    return (
      <a href={href} target="_blank"><i className="icon-facebook"></i></a>
    );
  },

  renderTwitterLink(params) {
    var encText = encode(truncate(params.subject, 90)),
        href = `https://twitter.com/share?url=${params.encUrl}&text=${encText}`;

    return (
      <a href={href} target="_blank"><i className="icon-twitter"></i></a>
    );
  },

  renderGooglePlusLink(params) {
    var href = `https://plus.google.com/share?url=${params.encUrl}`;

    return (
      <a href={href} target="_blank"><i className="icon-google-plus"></i></a>
    );
  },

  selectUrl() {
    this.refs.url.getDOMNode().select();
  }
});

function getSubject(title) {
  return `Poll: ${title}`;
}

function getUrl(pollId) {
  return `${window.location.origin}/#/${pollId}`;
}

function encode(text) {
  return encodeURIComponent(text);
}

function truncate(text, length) {
  return text.length > length ? text.substr(0, length) + '...' : text;
}

module.exports = Share;
