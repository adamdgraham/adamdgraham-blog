import React from 'react';
import { match, RoutingContext } from 'react-router';
import ReactDOMServer from 'react-dom/server';
import Express from 'express';
import configureStore from '../common/store/configureStore'

// Routes
import routes from '../common/routes';

// Express
const app = new Express();
//app.engine('html');
//app.set('views', __dirname + '/views');
app.use('/', Express.static(__dirname + '/static/'));
// This is fired every time the server side receives a request
//app.use(handleRender);
app.set('port', (process.env.PORT || 3000));

function getFullPage(html, state) {
  return `
    <!doctype html>
    <html>
      <head>
        <title>Adam D. Graham's Blog Party</title>
      </head>
      <body>
        <div id="app">${html}</div>
        <script>
          window.__PRELOADED_STATE__ = ${JSON.stringify(state)}
        </script>
        <script src="/static/bundle.js"></script>
      </body>
    </html>
    `
};

app.get('*', (req, res) => {
  match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
    const reactMarkup = ReactDOMServer.renderToString(
      <RoutingContext {...renderProps}/>
    );

    const fakePost = 'This is just some fake stuff!';
    const preloadedState = { fakePost };
    const store = configureStore(preloadedState);

    // Grab the initial state from our Redux store
    const finalState = store.getState();

    if (error) {
      res.status(500).send(error.message);
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else if (renderProps) {
      // Route looks good!
      res.status(200).send(getFullPage(reactMarkup, finalState));
    } else {
      res.status(404).send(getFullPage(reactMarkup, finalState));
    }
  })
});

app.listen(app.get('port'), (err) => {
  if (err) {
    console.log(err);
  } else {
    console.info('==> Server is listening in ' + process.env.NODE_ENV + ' mode');
    console.info('==> Go to http://localhost:%s', app.get('port'));
  }
});
