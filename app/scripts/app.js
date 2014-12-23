var React = window.React = require('react'),
    Router = require('react-router'),
  { Route, DefaultRoute, RouteHandler } = Router,
    Home = require('./views/home'),
    Answer = require('./views/answer'),
    Share = require('./views/share'),
    Result = require('./views/result'),
    mountNode = document.getElementById('app');

var App = React.createClass({
  render() {
    return (
      <div>
        <h1>polld</h1>
        <RouteHandler/>
      </div>
    );
  }
});

var routes = (
  <Route name="app" path="/" handler={App}>
    <DefaultRoute handler={Home}/>
    <Route name="answer" path=":key" handler={Answer}/>
    <Route name="share" path=":key/share" handler={Share}/>
    <Route name="result" path=":key/result" handler={Result}/>
  </Route>
);

Router.run(routes, (Handler) => React.render(<Handler/>, mountNode));
