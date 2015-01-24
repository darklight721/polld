var React = require('react/addons'),
    _ = require('underscore'),
    update = React.addons.update;

var ChoicesInput = React.createClass({
  propTypes: {
    value: React.PropTypes.arrayOf(React.PropTypes.string).isRequired
  },

  getInitialState() {
    return { value: [], isInvalid: {} };
  },

  componentWillMount() {
    this.setState({ value: this.props.value.map(toValue) });
  },

  render() {
    return (
      <div className="choices">
        <ul>{this.state.value.map(this.renderInput)}</ul>
        <button className="add-choice"
                type="button"
                onClick={this.handleAdd}>Add another choice</button>
      </div>
    );
  },

  renderInput(choice, index) {
    var className = 'choice';

    if (this.state.isInvalid[choice.id])
      className += ' input-invalid';

    return (
      <li key={choice.id}>
        <input className={className}
               ref={`choice${index}`}
               type="text"
               maxLength="100"
               placeholder="Enter choice here"
               value={choice.value}
               onChange={this.handleChange.bind(this, index)}
               onKeyPress={this.handleEnter}/>
        {this.renderDeleteButton(index)}
      </li>
    );
  },

  renderDeleteButton(index) {
    if (this.state.value.length > 2) {
      return (
        <button className="remove-choice"
                type="button"
                tabIndex="-1"
                onClick={this.handleRemove.bind(this, index)}>&times;</button>
      );
    }
  },

  handleAdd() {
    var value = update(this.state.value, { $push: [toValue('')] });

    this.setState({ value }, () => {
      this.refs[`choice${this.state.value.length - 1}`].getDOMNode().focus();
    });
  },

  handleChange(index, e) {
    var value = update(this.state.value, {
      [index]: { value: { $set: e.target.value } }
    });

    this.setState({ value }, () => this.validate(index));
  },

  handleRemove(index) {
    var value = update(this.state.value, { $splice: [[index, 1]] });
    this.setState({ value });
  },

  handleEnter(e) {
    if (e.which === 13)
      e.preventDefault();
  },

  validate(index) {
    var choices = this.state.value;

    if (choices.length < 2)
      return false;

    var choicesToValidate = index === undefined ? choices : [choices[index]],
        isInvalid = choicesToValidate.reduce((isInvalid, choice) => {
          var value = choice.value.trim();

          isInvalid[choice.id] = !value ||
            choices.filter(a => a.value.trim() === value).length > 1;

          return isInvalid;
        }, {});

    this.setState({
      isInvalid: update(this.state.isInvalid, { $merge: isInvalid })
    });

    return !_.some(isInvalid);
  },

  value() {
    return this.state.value.map(({ value }) => value.trim());
  }
});

function toValue(value) {
  return { id: _.uniqueId(), value, isValid: true };
}

module.exports = ChoicesInput;
