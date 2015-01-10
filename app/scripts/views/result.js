var React = require('react'),
  { Results } = require('../store'),
    _ = require('underscore');

var Result = React.createClass({
  propTypes: {
    pollId: React.PropTypes.string.isRequired,
    poll: React.PropTypes.object.isRequired
  },

  setResult(props) {
    Results.listen(props.pollId, (data) => {
      var result = data || {};
      this.setState({ result, total: _.reduce(result, sum, 0) });
    });
  },

  getInitialState() {
    return { result: {} };
  },

  componentWillMount() {
    this.setResult(this.props);
  },

  componentWillUnmount() {
    Results.stop();
  },

  componentWillReceiveProps(props) {
    this.setResult(props);
  },

  render() {
    var choices = this.getChoicesWithResult();

    return (
      <div className="result">
        <ul>{choices.map(this.renderResult)}</ul>
      </div>
    );
  },

  renderResult(choice, index) {
    var percentage = this.state.total ?
                     choice.result / this.state.total * 100 : 0;
        style = { width: `${percentage}%` };

    return (
      <li key={index}>
        <div className="choice-graph" style={style}></div>
        <div className="choice">{choice.name}</div>
        <div className="choice-result">{choice.result}</div>
      </li>
    );
  },

  getChoicesWithResult() {
    var result = this.state.result;
    return _.chain(this.props.poll.choices)
            .map((name, index) => {
              return { name, result: result[index] || 0 } })
            .sortBy('result')
            .reverse()
            .value();
  }
});

function sum(a, b) {
  return (a || 0) + (b || 0);
}

module.exports = Result;
