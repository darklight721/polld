var React = require('react'),
    Router = require('react-router'),
    _ = require('underscore'),
    TitleInput = require('./home/title-input'),
    ChoicesInput = require('./home/choices-input'),
    AllowMultipleAnswersInput = require('./home/allow-multiple-answers-input'),
  { Polls } = require('../store');

var Home = React.createClass({
  mixins: [ Router.Navigation ],

  model: {
    title: { ref: 'input1', value: '' },
    choices: { ref: 'input2', value: ['', ''] },
    allowMultipleAnswers: { ref: 'input3', value: false }
  },

  render() {
    return (
      <form className="form" onSubmit={this.submit}>
        <div className="field">
          <label>Poll Title</label>
          <TitleInput {...this.model.title}/>
        </div>
        <div className="field">
          <label>Poll Choices</label>
          <ChoicesInput {...this.model.choices}/>
        </div>
        <div className="field">
          <label className="multiple-answers">
            <AllowMultipleAnswersInput {...this.model.allowMultipleAnswers}/>
            Allow multiple answers?
          </label>
        </div>
        <div className="form-actions">
          <button>Create poll</button>
        </div>
      </form>
    );
  },

  submit(e) {
    e.preventDefault();

    if (this.validate()) {
      var pollId = Polls.create(this.serialize());
      this.transitionTo('share', { pollId });
    }
  },

  validate() {
    return _.map(this.model, ({ ref }) => this.refs[ref].validate())
            .every(isValid => isValid);
  },

  serialize() {
    return _.reduce(this.model, (values, { ref }) => {
      values[ref] = this.refs[ref].value();
      return values;
    }, {});
  }
});

module.exports = Home;
