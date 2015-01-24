var React = require('react');

var TitleInput = React.createClass({
  propTypes: {
    value: React.PropTypes.string.isRequired
  },

  getInitialState() {
    return { value: '', isInvalid: false };
  },

  componentWillMount() {
    this.setState({ value: this.props.value });
  },

  render() {
    var className = 'title';

    if (this.state.isInvalid)
      className += ' input-invalid';

    return (
      <input className={className}
           type="text"
           maxLength="200"
           placeholder="Enter title here"
           value={this.state.value}
           onChange={this.handleChange}
           onKeyPress={this.handleEnter}/>
    );
  },

  handleChange(e) {
    var value = e.target.value;

    this.setState({ value });
    this.validate(value);
  },

  handleEnter(e) {
    if (e.which === 13)
      e.preventDefault();
  },

  validate(_value) {
    var value = _value === undefined ? this.state.value : _value,
        isInvalid = !value.trim();

    this.setState({ isInvalid });
    return !isInvalid;
  },

  value() {
    return this.state.value.trim();
  }
});

module.exports = TitleInput;
