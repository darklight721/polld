var React = require('react');

var Input = React.createClass({
  getInitialState() {
    return { isValid: true };
  },

  getDefaultProps() {
    return {
      type: 'text',
      className: '',
      onChange: () => {},
      validate: () => true
    };
  },

  render() {
    var { className } = this.props;

    if (this.isInvalid())
      className += ' input-invalid';

    return (
      <input {...this.props}
             className={className}
             onChange={this.handleChange}/>
    );
  },

  handleChange(e) {
    this.props.onChange(e);
    this.validate(e.target.value);
  },

  validate(value) {
    value = value || this.getDOMNode().value;
    this.setState({ isValid: this.props.validate(value) });
  },

  isInvalid() {
    return !this.state.isValid;
  }
});

module.exports = Input;
