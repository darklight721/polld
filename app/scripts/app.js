var React = window.React = require('react'),
    Router = require('react-router'),
  { Route, DefaultRoute, RouteHandler } = Router,
    Home = require('./views/home'),
    mountNode = document.getElementById("app");

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
  </Route>
);

Router.run(routes, (Handler) => React.render(<Handler/>, mountNode));
