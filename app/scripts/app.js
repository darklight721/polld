var React = window.React = require('react'),
    Router = require('react-router'),
  { Route, DefaultRoute, RouteHandler } = Router,
    Home = require('./views/home'),
    Poll = require('./views/poll'),
    Answer = require('./views/answer'),
    Share = require('./views/share'),
    Result = require('./views/result'),
    NotFound = require('./views/not-found'),
    mountNode = document.getElementById('app');

var App = React.createClass({
  render() {
    return <RouteHandler/>;
  }
});

var routes = (
  <Route name="app" path="/" handler={App}>
    <DefaultRoute handler={Home}/>
    <Route name="404" handler={NotFound}/>
    <Route name="poll" path=":pollId" handler={Poll}>
      <DefaultRoute handler={Answer}/>
      <Route name="share" handler={Share}/>
      <Route name="result" handler={Result}/>
    </Route>
  </Route>
);

Router.run(routes, (Handler) => React.render(<Handler/>, mountNode));
