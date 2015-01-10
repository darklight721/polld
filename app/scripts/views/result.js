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
      this.setState({ result: data || {} });
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
    return <li key={index}>{`${choice.name} - ${choice.result}`}</li>;
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

module.exports = Result;
