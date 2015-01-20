var React = require('react'),
    Router = require('react-router'),
    TitleInput = require('./home/title-input'),
    ChoicesInput = require('./home/choices-input'),
    AllowMultipleAnswersInput = require('./home/allow-multiple-answers-input'),
  { Polls } = require('../store');

var Home = React.createClass({
  mixins: [ Router.Navigation ],

  inputs: ['title', 'choices', 'allowMultipleAnswers'],

  render() {
    return (
      <form className="form" onSubmit={this.submit}>
        <div className="field">
          <label>Poll Title</label>
          <TitleInput ref={this.inputs[0]} value={''}/>
        </div>
        <div className="field">
          <label>Poll Choices</label>
          <ChoicesInput ref={this.inputs[1]} value={['', '']}/>
        </div>
        <div className="field">
          <label className="multiple-answers">
            <AllowMultipleAnswersInput ref={this.inputs[2]} value={false}/>
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
    return this.inputs.map(a => this.refs[a].validate())
                      .every(a => a);
  },

  serialize() {
    return this.inputs.reduce((values, input) => {
      values[input] = this.refs[input].value;
      return values;
    }, {});
  }
});

module.exports = Home;
