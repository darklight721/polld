var React = require('react'),
    Router = require('react-router'),
    Store = require('../store'),
    _ = require('underscore');

var Result = React.createClass({
  mixins: [ Router.State ],

  statics: {
    willTransitionTo(transition, params) {
      transition.wait(
        Store.fetchPoll(params.key)
             .then((data) => !data && transition.redirect('404'))
      );
    }
  },

  getStateFromStore() {
    var { key } = this.getParams();
    return {
      poll: Store.getPoll(key) || {},
      result: {}
    }
  },

  getResultFromStore() {
    var { key } = this.getParams();
    Store.listenToResult(key, (data) => {
      this.setState({ result: data });
    });
  },

  getInitialState() {
    return this.getStateFromStore();
  },

  componentWillReceiveProps() {
    this.setState(this.getStateFromStore());
    this.getResultFromStore();
  },

  componentWillMount() {
    this.getResultFromStore();
  },

  componentWillUnmount() {
    Store.stopListeningToResult();
  },

  render() {
    return (
      <div>
        {this.state.poll.question}
        {this.renderResult()}
      </div>
    );
  },

  renderResult() {
    var result = this.state.result,
        choices = _.chain(this.state.poll.choices)
                   .map((choice, index) => {
                     return { name: choice, result: result[index] || 0 } })
                   .sortBy('result')
                   .reverse()
                   .value();

    return (
      <ul>{
        choices.map((choice, index) => {
          return <li key={index}>{`${choice.name} - ${choice.result}`}</li>;
        })
      }</ul>
    );
  }
});

module.exports = Result;
