var React = require('react'),
    Router = require('react-router'),
    TitleInput = require('./home/title-input'),
    ChoicesInput = require('./home/choices-input'),
    AllowMultipleAnswersInput = require('./home/allow-multiple-answers-input'),
  { Polls } = require('../store');

var Home = React.createClass({
  mixins: [ Router.Navigation ],

  render() {
    return (
      <form className="form" onSubmit={this.submit}>
        <div className="field">
          <label>Poll Title</label>
          <TitleInput value={''}/>
        </div>
        <div className="field">
          <label>Poll Choices</label>
          <ChoicesInput value={['', '']}/>
        </div>
        <div className="field">
          <label className="multiple-answers">
            <AllowMultipleAnswersInput value={false}/>
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
    // validate here

    var pollId = Polls.create(poll);
    this.transitionTo('share', { pollId });
  }
});

module.exports = Home;
