var React = require('react');

var AllowMultipleAnswersInput = React.createClass({
  propTypes: {
    value: React.PropTypes.bool.isRequired
  },

  getInitialState() {
    return { value: false };
  },

  componentWillMount() {
    this.setState({ value: this.props.value });
  },

  render() {
    return (
      <input type="checkbox"
             value={this.state.value}
             onChange={this.handleChange}/>
    );
  },

  handleChange() {
    this.setState({ value: !this.state.value });
  },

  validate() {
    return true;
  },

  value() {
    return this.state.value;
  }
});

module.exports = AllowMultipleAnswersInput;
