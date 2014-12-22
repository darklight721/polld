var React = require('react');

var Choices = React.createClass({
  propTypes: {
    list: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    onChange: React.PropTypes.func.isRequired
  },
  componentDidUpdate() {
    if (!this.shouldFocusLast) return;

    focus(this.refs[this.props.list.length - 1]);
    this.shouldFocusLast = false;
  },
  render() {
    return (
      <div>
        <label>Enter choices</label>
        <ul>{this.props.list.map(this.renderChoice)}</ul>
        <button type="button" onClick={this.handleAdd}>Add another choice</button>
      </div>
    );
  },
  renderChoice(choice, index) {
    return (
      <li key={choice + index}>
        <input ref={index}
               type="text"
               defaultValue={choice}
               onBlur={this.handleChange.bind(this, index)}
               onKeyPress={this.handleEnter.bind(this, index)}/>
        <button type="button" onClick={this.handleRemove.bind(this, index)}>&times;</button>
      </li>
    );
  },
  handleAdd() {
    this.shouldFocusLast = true;
    this.props.onChange('');
  },
  handleChange(index, e) {
    this.props.onChange(e.target.value, index);
  },
  handleRemove(index) {
    this.props.onChange(null, index);
  },
  handleEnter(index, e) {
    if (e.which !== 13) return;

    var nextItem = this.refs[index + 1];
    nextItem ? focus(nextItem) : this.handleAdd();
  }
});

function focus(ref) {
  ref.getDOMNode().focus();
}

module.exports = Choices;
